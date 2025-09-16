import express from "express"
import inputValidation from "../middlewares/schemaValidate.js"
import { userResetPasswordSchema, userSigninInputValidation, userSignupInputValidation } from "../validations/userValidation.js"
import { forgotPassword, logout, profile, resetPassword, signin, signup, verify, verifyOtp } from "../controllers/authController.js"
import { isAuthenticated } from "../middlewares/auth.js"

const authRouter = express.Router()

authRouter.post("/signup", inputValidation(userSignupInputValidation), signup)
authRouter.post("/verify", verify)
authRouter.post("/signin", inputValidation(userSigninInputValidation), signin)
authRouter.post("/forgot-password", forgotPassword)
authRouter.post("/verify-otp", verifyOtp)
authRouter.patch("/reset-password", inputValidation(userResetPasswordSchema), resetPassword)
authRouter.get("/profile", isAuthenticated, profile)
authRouter.post("/logout", isAuthenticated, logout)

export default authRouter