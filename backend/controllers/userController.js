import mongoose from "mongoose";
import User from "../models/userModel.js";
import Transaction from "../models/transaction.js";
import { promise } from "zod";

export const getAllUser = async (req, res) => {
  const user = req.user;
  const search = req.query?.search;

  try {
    let query = {};

    if (search) {
      const searchString = search.toString();
      query = {
        $or: [
          { username: { $regex: searchString, $options: "i" } },
          { name: { $regex: searchString, $options: "i" } },
        ],
      };
    }

    const users = await User.find(query).select(
      "-otp -otpExpiresAt -email -balance -createdAt -updatedAt"
    );
    const filteredUsers = users.filter(
      (usr) => usr._id.toString() !== user._id.toString()
    );

    if (filteredUsers.length === 0) {
      return res.status(204).json({
        success: true,
        message: search ? "No user matched" : "Currently there are no users",
        users: [],
      });
    }

    return res.status(200).json({
      success: true,
      users: filteredUsers,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server error. Try again!",
    });
  }
};

export const getParticularUser = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "could not find the user without id. Try again!",
    });
  }
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "invalid user id. Try again!",
    });
  }
  try {
    const user = await User.findById(id).select(
      "-otp -otpExpiresAt -email -balance -createdAt -updatedAt"
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found. Try again!",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("Error in getting a particular user", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Try again!",
    });
  }
};

export const sendMoney = async (req, res) => {
  const user = req.user;
  const receiverId = req.params.id;
  let amount = Number(req.body.amount);

  if (!receiverId) {
    return res.status(400).json({
      success: false,
      message: "Could not find the user without id. Failed to send money",
    });
  }

  if (!mongoose.isValidObjectId(receiverId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user id. Transaction failed!",
    });
  }

  if (!amount || amount < 1 || isNaN(amount) || !Number.isFinite(amount)) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid amount",
    });
  }

  amount = Number(amount.toFixed(2));

  if (amount > 1000000) {
    return res.status(400).json({
      success: false,
      message: "Amount exceeds the maximum limit",
    });
  }

  if (user._id.toString() === receiverId) {
    return res.status(400).json({
      success: false,
      message: "Cannot send money to yourself",
    });
  }

  const receiver = await User.findById(receiverId);
  if (!receiver) {
    return res.status(404).json({
      success: false,
      message: "Receiver user not found. Transaction failed",
    });
  }

  if (user.balance < amount) {
    return res.status(400).json({
      success: false,
      message: "Insufficient balance",
    });
  }

  const MAX_BALANCE = 100000000;
  if (receiver.balance + amount > MAX_BALANCE) {
    return res.status(400).json({
      success: false,
      message: "Receiver balance limit exceeded",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    user.balance -= amount;
    receiver.balance += amount;

    await user.save({ session });
    await receiver.save({ session });

    await Transaction.create(
      [{ sender: user._id, receiver: receiverId, amount: amount }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Transaction successful",
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.error("Transaction error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Transaction failed",
    });
  }
};

export const moneyDeposite = async (req, res) => {
  const user = req.user;

  try {
    let amount = Number(req.body.amount);

    const MAX_DEPOSITE = 1000000;
    const MAXIMUM_BALANCE = 999999999999999;

    if (!amount || amount < 1 || isNaN(amount) || !Number.isFinite(amount)) {
      return res.status(400).json({
        success: false,
        message: "Enter the valid amount",
      });
    }

    amount = Number(amount.toFixed(2));

    if (amount > MAX_DEPOSITE) {
      return res.status(400).json({
        success: false,
        message: "Maximum deposite amount reached",
        MAX_DEPOSITE,
      });
    }

    if (user.balance + amount > MAXIMUM_BALANCE) {
      return res.status(400).json({
        success: false,
        message: `Cannot deposit. Balance cannot exceed ${MAXIMUM_BALANCE}`,
      });
    }

    const amountInPaise = Math.round(amount * 100);

    user.balance += amountInPaise;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Deposite successful",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server Error. Deposite failed!",
    });
  }
};

