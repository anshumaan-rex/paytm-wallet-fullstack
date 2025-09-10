import Token from "../models/token.js";
import User from "../models/userModel.js";
import {
  comparePassword,
  generateToken,
  hashPassword,
} from "../utils/authUtills.js";
import transporter from "../utils/mailer.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { name, username, email, password } = req.userInputData;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: "user already exist whith email",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    const token = await generateToken(user._id);
    const verifyURL = `${process.env.FRONTEND_URL}/verify?token=${token}`;

    try {
      await transporter.sendMail({
        from: `"Paytm" <${process.env.SMTP_FROM}>`,
        to: email,
        subject: "Verify your Paytm account",
        html: `<p>Click on the link to verify: <a href="${verifyURL}">${verifyURL}</a>.Or you can copy paste link in your browser</p>`,
      });
    } catch (emailErr) {
      await Token.deleteMany({ user: user._id });
      await User.findByIdAndDelete(user._id);

      console.log("Failed to send verification Email", emailErr);
      return res.status(500).json({
        success: false,
        error:
          "Failed to send verification email. Please try signing up again!",
      });
    }

    return res.status(201).json({
      success: true,
      message: "signed up successfully",
    });
  } catch (err) {
    console.error("Error in signup", err);
    return res.status(500).json({
      error: "Server error. Please try again!",
    });
  }
};

export const verify = async (req, res) => {
  try {
    const token = req.query?.token;
    if (!token) {
      return res.status(400).json({
        success: false,
        message:
          "Missing verification token. Please click on the verification link again or signup again",
      });
    }

    const dbUser = await Token.findOne({ token });
    if (!dbUser) {
      return res.status(404).json({
        success: false,
        message:
          "Token not found. Use the verification link again. If copy pasted then verify again",
      });
    }

    if (dbUser.expiresAt < Date.now()) {
      return res.status(401).json({
        success: false,
        message:
          "Link expired. please signup again to get the new verification link",
      });
    }

    await User.findByIdAndUpdate(dbUser.user, { isVerified: true });
    await Token.findByIdAndDelete(dbUser._id);

    return res.status(200).json({
      success: true,
      message: "verification successfull",
    });
  } catch (err) {
    console.error("Error in email verification", err);
    return res.status(500).json({
      success: false,
      error: "Server error. Please try again!",
    });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.userInputData;

  try {
    const user = await User.findOne({ email }).select("+password -otp -otpExpiresAt");
    const isMatched = await comparePassword(password, user?.password);

    if (!user || !isMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email before signing in",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "20d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 20 * 24 * 60 * 60 * 1000,
    });

    user.password = undefined
    return res.status(200).json({
      success: true,
      message: "signin successful",
      user,
    });
  } catch (err) {
    console.error("Error in signing in", err);
    return res.status(500).json({
      success: false,
      error: "Server error. Please try again!",
    });
  }
};

