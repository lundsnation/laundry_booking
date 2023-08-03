import mongoose from 'mongoose'
import { addEventLogging } from '../utils/backendLogger'

const BookingSchema = new mongoose.Schema({
  userName: String,
  date: Date,
  timeSlot: String,
  createdAt: Date
})

BookingSchema.index({ userName: 1, date: 1 }, { unique: true });

const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema)

//print header for logger here
//console.log("RUNNING ADDEVENTLOGGING");
//addEventLogging();

export default Booking;