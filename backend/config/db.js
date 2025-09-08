import mongoose from "mongoose"

async function connectDB () {
  try{
    const conn = await mongoose.connect(`${process.env.MONGODB_URI}/paytmWallet`)
    console.log(`Database is connected: ${conn.connection.host}`)
  }catch(err){
    console.error('Error in connecting to database!', err.message)
    process.exit(1)
  }
}

export default connectDB