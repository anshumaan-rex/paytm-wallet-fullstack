import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getAllUser } from "../controllers/userController.js";

const userRouter = Router()

userRouter.get("/all", isAuthenticated, getAllUser)

export default userRouter