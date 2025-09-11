import express from "express"
import inputValidation from "../middlewares/schemaValidate.js"
import { userSigninInputValidation, userSignupInputValidation } from "../validations/userValidation.js"
import { forgotPassword, signin, signup, verify } from "../controllers/authController.js"

const authRouter = express.Router()

authRouter.post("/signup", inputValidation(userSignupInputValidation), signup)
authRouter.post("/verify", verify)
authRouter.post("/signin", inputValidation(userSigninInputValidation), signin)
authRouter.post("/forgot-password", forgotPassword)

export default authRouter