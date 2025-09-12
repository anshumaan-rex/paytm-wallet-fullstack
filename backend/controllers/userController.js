import mongoose from "mongoose";
import User from "../models/userModel.js";

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

    const users = await User.find(query).select("-otp -otpExpiresAt -email -balance -createdAt -updatedAt")
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

export const getParticularUser = async (req,res) => {
  const id = req.params.id
  if(!id) {
    return res.status(400).json({
      success: false,
      message: "could not find the user without id. Try again!"
    })
  }
  if(!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "invalid user id. Try again!"
    })
  }
  try{
    const user = await User.findById(id).select("-otp -otpExpiresAt -email -balance -createdAt -updatedAt")
    if(!user) {
      return res.status(404).json({
        success: false,
        message: "user not found. Try again!"
      })
    }
    return res.status(200).json({
      success: true,
      user
    })
  }catch(err){
    console.error("Error in getting a particular user", err)
    return res.status(500).json({
      success: false,
      message: "Server error. Try again!"
    })
  }
}
