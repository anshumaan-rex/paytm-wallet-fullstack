import dotenv from "dotenv"
dotenv.config({ quiet: true })

import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "./config/db.js"

const app = express()
const port = process.env.PORT || 4000

app.use(express.json())
app.use(cors())
app.use(cookieParser())

app.get("/", (req,res) => {
  res.status(200).send("ok")
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