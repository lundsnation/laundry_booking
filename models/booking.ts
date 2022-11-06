import mongoose, { Model } from "mongoose"


// Axel: First implementation of schema, only requires 
// apt. number for tenant, along with time-data.

const BookingSchema = new mongoose.Schema({
    time: Number,
    date: Date,
    building: String,
    tenant: Number,
  });

  const BookedTime = mongoose.model("Booking", BookingSchema);

  module.exports = {
    BookedTime: BookedTime
  }