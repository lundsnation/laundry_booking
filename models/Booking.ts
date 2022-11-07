import mongoose from 'mongoose'

const BookingSchema = new mongoose.Schema({
    time: Number,
    date: Date,
    building: String,
    tenant: Number,
  })

const Booking = mongoose.models.Booking || mongoose.model("Bookings", BookingSchema)

export default Booking;