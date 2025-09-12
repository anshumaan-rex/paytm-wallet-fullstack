import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getAllUser, getParticularUser, moneyDeposite, sendMoney } from "../controllers/userController.js";

const userRouter = Router()

userRouter.get("/all", isAuthenticated, getAllUser)
userRouter.get("/:id", isAuthenticated, getParticularUser)
userRouter.post("/:id", isAuthenticated, sendMoney)
userRouter.post("/deposite/wallet", isAuthenticated, moneyDeposite)

export default userRouter