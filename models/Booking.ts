import mongoose from 'mongoose'

const BookingSchema = new mongoose.Schema({
    date: Date,
    building: String,
    tenant: Number,
  })
  
  export default mongoose.models['Booking'] || mongoose.model("Booking", BookingSchema)
