//IMPORT MONGOOSE
import mongoose, { Model } from "mongoose"

// CONNECTING TO MONGOOSE (Get Database Url from .env.local)
const { DATABASE_URL } = process.env

// connection function
export const connect = async () => {
  const conn = await mongoose
    .connect(DATABASE_URL as string)
    .catch(err => console.log(err))
  console.log("Mongoose Connection Established")

  // OUR TODO SCHEMA
  const BookingSchema = new mongoose.Schema({
    time: String,
    booken: Boolean
  });

  // OUR TODO MODEL
  const Booking = mongoose.models.Booking || mongoose.model("bookings", BookingSchema)

  return { conn, Booking }
 
}