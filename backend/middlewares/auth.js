import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(404).json({
        success: false,
        message: "session timeout login again!",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Login again. Something bad happened",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Error in authentication", err);
    return res.status(500).json({
      success: false,
      error: "Server error. Try again!",
    });
  }
};
