import express from "express"
import inputValidation from "../middlewares/schemaValidate.js"
import { userResetPasswordSchema, userSigninInputValidation, userSignupInputValidation } from "../validations/userValidation.js"
import { forgotPassword, resetPassword, signin, signup, verify } from "../controllers/authController.js"

const authRouter = express.Router()

authRouter.post("/signup", inputValidation(userSignupInputValidation), signup)
authRouter.post("/verify", verify)
authRouter.post("/signin", inputValidation(userSigninInputValidation), signin)
authRouter.post("/forgot-password", forgotPassword)
authRouter.patch("/reset-password", inputValidation(userResetPasswordSchema), resetPassword)

export default authRouter