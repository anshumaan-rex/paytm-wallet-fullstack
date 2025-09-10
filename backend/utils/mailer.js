import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config({ quiet: true })
console.log(process.env.SMTP_USER)

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

export default transporter