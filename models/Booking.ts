import { dateRangePickerDayClasses } from '@mui/lab';
import mongoose from 'mongoose'

//These can be added to some config later on to increase modularity.
const debug = false;
//const writeToFile = false;


const BookingSchema = new mongoose.Schema({
    date: Date,
    userName: String
  })

const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema)

//print header for logger [type nanana]
const addEventListeners = () => {
  //0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
// Demonstrate the readyState and on event emitters

//const HEADER = "[ TYPE \t nånting]"

  debug && console.log('[ readyStates: { 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting } ]')
debug && console.log("readyState:" + mongoose.connection.readyState); //logs 0

mongoose.connection.on('connecting', () => {  
  console.log('LOGGER: [ Connecting to database! \t\t' + (new Date()).toLocaleString() + " ]")
  debug && console.log("readyState:" + mongoose.connection.readyState); //logs 2
});

mongoose.connection.on('connected', () => {
  console.log('LOGGER: [ Connected to database! \t\t' + (new Date()).toLocaleString() + " ]")  
  debug && console.log("readyState:" + mongoose.connection.readyState); //logs 1
});

mongoose.connection.on('disconnecting', () => {
  console.log('LOGGER: [ Disconnecting from database! \t\t' + (new Date()).toLocaleString() + " ]")  
  debug && console.log("readyState:" + mongoose.connection.readyState); // logs 3
});

mongoose.connection.on('disconnected', () => {
  console.log('LOGGER: [ Disconnected from database! \t\t' + (new Date()).toLocaleString() + " ]")  
  debug && console.log("readyState:" + mongoose.connection.readyState); //logs 0
});
}

addEventListeners();

export default Booking;