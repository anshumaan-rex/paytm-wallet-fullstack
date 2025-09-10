import express from "express"
import inputValidation from "../middlewares/schemaValidate.js"
import { userSignupInputValidation } from "../validations/userValidation.js"
import { signup, verify } from "../controllers/authController.js"

const authRouter = express.Router()

authRouter.post("/signup", inputValidation(userSignupInputValidation), signup)
authRouter.post("/verify", verify)

export default authRouter