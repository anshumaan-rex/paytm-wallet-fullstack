import dotenv from "dotenv"
dotenv.config({ quiet: true })

import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "./config/db.js"
import helmet from "helmet"
import morgan from "morgan"

import authRouter from "./routes/authRoutes.js"
import userRouter from "./routes/userRoutes.js"

const app = express()
const port = process.env.PORT || 4000

app.use(helmet())
app.use(express.json())
app.use(cors({ origin:{}, credentials: true }))
app.use(cookieParser())
app.use(morgan("dev"))

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/users", userRouter)

app.get("/", (req,res) => {
  res.status(200).send("ok")
})

app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" })
})


app.use((err,req,res,next) => {
  console.log(err.stack)
  res.status(500).json({ 
    error: "Something went wrong!" 
  })
})

connectDB().then(() => {
  app.listen(port, ()=> {
    console.log(`Server is up at: http://localhost:${port}`)
  })
})