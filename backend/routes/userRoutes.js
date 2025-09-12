import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getAllUser, getParticularUser } from "../controllers/userController.js";

const userRouter = Router()

userRouter.get("/all", isAuthenticated, getAllUser)
userRouter.get("/:id", isAuthenticated, getParticularUser)

export default userRouter