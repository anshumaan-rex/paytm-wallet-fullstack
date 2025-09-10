import express from "express"
import inputValidation from "../middlewares/schemaValidate.js"
import { userSignupInputValidation } from "../validations/userValidation.js"
import { signup } from "../controllers/authController.js"

const authRouter = express.Router()

authRouter.post("/signup", inputValidation(userSignupInputValidation), signup)

export default authRouter