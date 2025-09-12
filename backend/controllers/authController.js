import Token from "../models/token.js";
import User from "../models/userModel.js";
import {
  comparePassword,
  generateOtp,
  generateToken,
  hashPassword,
  verifyHashedOtp,
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
      message: "Verification email has been sent to your email ID",
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
    const user = await User.findOne({ email }).select(
      "+password -otp -otpExpiresAt"
    );
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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "20d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 20 * 24 * 60 * 60 * 1000,
    });

    user.password = undefined;
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

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email id is required",
    });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No user found with this email",
      });
    }
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Verify your email to change your password",
      });
    }

    const { otp, hashedOtp, otpExpiresAt } = generateOtp();

    user.otp = hashedOtp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    try {
      await transporter.sendMail({
        from: `"Paytm" <${process.env.SMTP_FROM}>`,
        to: email,
        subject: "OTP for your Password reset",
        html: `<p>This is the OTP for your Paytm account for resetting your password <b>${otp}</b> Valid for 5 minutes</p>`,
      });
    } catch (emailErr) {
      console.error("Error in sending password reset OTP", emailErr);
      (user.otp = null), (user.otpExpiresAt = null);
      await user.save();

      return res.status(500).json({
        success: false,
        error: "Failed to send password reset otp email. Please try again!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP has been been sent on your email",
    });
  } catch (err) {
    console.error("Error in forgot password", err);
    return res.status(500).json({
      success: false,
      error: "Server error. Please try again!",
    });
  }
};

export const verifyOtp = async (req, res) => {
  const { otp, email } = req.body;

  if (!otp) {
    return res.status(400).json({
      success: false,
      message: "OTP is required",
    });
  }

  if (!email) {
    return res.status(401).json({
      success: false,
      message: "session manupulated. Please try after sometime!",
    });
  }
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.otp || !user.otpExpiresAt) {
      return res.status(400).json({
        success: false,
        message: "No OTP request found for this user",
      });
    }

    if (user.otpExpiresAt < Date.now()) {
      return res.status(401).json({
        success: false,
        message: "OTP has expired, please request again",
      });
    }

    const hashedOtp = verifyHashedOtp(otp);

    if (hashedOtp !== user.otp) {
      return res.status(401).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully. You can now reset your password",
    });
  } catch (err) {
    console.error("Error in verifying OTP", err);
    return res.status(500).json({
      success: false,
      error: "Server error. Please try again!",
    });
  }
};

export const resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;
  try {
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }
    if (!email) {
      return res.status(401).json({
        success: false,
        message: "session manupulated. Please try after sometime!",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const profile = (req,res) => {
  const user = req.user;
  const { otp, otpExpiresAt, createdAt, updatedAt, ...userDetails } = user.toObject()
  return res.status(200).json({
    success: true,
    user: userDetails
  })
}