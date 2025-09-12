import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getAllUser, getParticularUser, sendMoney } from "../controllers/userController.js";

const userRouter = Router()

userRouter.get("/all", isAuthenticated, getAllUser)
userRouter.get("/:id", isAuthenticated, getParticularUser)
userRouter.post("/:id", isAuthenticated, sendMoney)

export default userRouter