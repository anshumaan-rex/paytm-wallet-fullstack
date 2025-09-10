import { z } from "zod"

export const userSignupInputValidation = z.object({
  name: z.string().min(3, { error: "name should have at least 3 letters" }).max(40, { error: "name should be under 40 letters" }),
  username: z.string().trim().max(30, { error: "username is too long. Max allowed length is 30" }),
  email: z.email(),
  password: z.string().trim().min(8, { error: "Password must be at least 8 character long" }).max(64, { error: "Password must be under 64 character" })
})

export const userSigninInputValidation = z.object({
  email: z.email(),
  password: z.string().trim().min(1, { error: "Password is required" })
})