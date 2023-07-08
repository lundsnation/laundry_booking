import mongoose from 'mongoose'
import { addEventLogging } from '../utils/backendLogger'

const BookingSchema = new mongoose.Schema({
  userName: String,
  date: Date,
  timeSlot: String,
  createdAt: Date
})

const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema)

//print header for logger here
//console.log("RUNNING ADDEVENTLOGGING");
//addEventLogging();

export default Booking;