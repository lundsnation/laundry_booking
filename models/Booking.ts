import mongoose from 'mongoose'
import { addEventLogging } from '../utils/backendLogger'

const BookingSchema = new mongoose.Schema({
    date: {
      type: Date,
      required: true,
      unique: true
    },
    userName: {
      type: String,
      required: true
    }
  })
// 
//BookingSchema.path('date').index({ unique: true });

const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema)

//print header for logger here

addEventLogging();

export default Booking;