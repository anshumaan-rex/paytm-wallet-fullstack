import bcrypt from "bcryptjs";
import crypto from "crypto";
import Token from "../models/token.js";

export async function hashPassword(password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}

export async function generateToken(userId) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await Token.create({
    user: userId,
    token,
    expiresAt,
  });
  return token;
}
