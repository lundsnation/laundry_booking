import mongoose from 'mongoose'
import { addEventLogging } from '../utils/backendLogger'

const BookingSchema = new mongoose.Schema({
    date: Date,
    userName: String
  })

const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema)

//print header for logger [type nanana]


addEventLogging();

export default Booking;