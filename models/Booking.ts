import mongoose from 'mongoose'
import UserProfile  from "@auth0/nextjs-auth0";

const BookingSchema = new mongoose.Schema({
    date: Date,
    userName: String
  })

const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema)

export default Booking;