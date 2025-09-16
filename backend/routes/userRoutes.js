import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getAllUser, getParticularUser, getTransactions, moneyDeposite, sendMoney } from "../controllers/userController.js";

const userRouter = Router()

userRouter.get("/all", isAuthenticated, getAllUser)
userRouter.get("/:id", isAuthenticated, getParticularUser)
userRouter.post("/send/:id", isAuthenticated, sendMoney)
userRouter.post("/deposite/wallet", isAuthenticated, moneyDeposite)
userRouter.get("/transactions/:id", isAuthenticated, getTransactions)

export default userRouter