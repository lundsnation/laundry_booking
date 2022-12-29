// Interface to defining our object of response functions
export interface ResponseFuncs {
  GET?: Function
  POST?: Function
  PUT?: Function
  DELETE?: Function
  PATCH?: Function
}

// Type to define our Todo model on the frontend
export type Booking = {
  _id?: number,
  userName: string,
  date: Date,
  timeSlot: string,
}
// User object, as defined by 
export type UserType = {
    user_id?: string,
    name: string,
    email: string,
    app_metadata?: {acceptedTerms?: boolean, allowedSlots?: number, roles?: Array<string>},
    user_metadata?: {telephone: string},
    connection : "Username-Password-Authentication",
    password?: string
}
// ENUM to keep track of button state
export const enum BUTTON_STATES {
  // Time is bookable == no occurence in DB
  AVAILIBLE = 0,
  // Time is non-bookable for user == Occurence in DB from another user
  UNAVAILIBLE = 1,
  // Time can be cancelled by user == Occurence in DB from this user
  EDITABLE = 2
}

// Function used for setting the correct time in the booking in DB
export function timeFromTimeSlot(date: Date, timeSlot: string){
  // Aquire date, generates date at 00:00
  const tempDate = new Date(date.getFullYear(),date.getMonth(),date.getDate())
  const newTime = tempDate.getTime() + convTimes[timeSlots.indexOf(timeSlot)]
  return new Date(newTime)
}
// Slottimes, displayed in the bookable slots
export const timeSlots: Array<string> = ["07:00-08:30",
                                    "08:30-10:00",
                                    "10:00-11:30",
                                    "11:30-13:00",
                                    "13:00-14:30",
                                    "14:30-16:00",
                                    "16:00-17:30",
                                    "17:30-19:00",
                                    "19:00-20:30",
                                    "20:30-22:00"]


// Milliseconds for the given timeslot in timeSlots, used for setting correct time in DB in timeFromTimeSlot
const convTimes: Array<number> = [25200000,
                                  30600000,
                                  36000000,
                                  39600000,
                                  46800000,
                                  52200000,
                                  57600000,
                                  63000000,
                                  68400000,
                                  73800000]  
                          


  // Error messages
export const enum ERROR_MSG {
  // General error
  GENERAL = "Internt fel, Ladda om sidan",
  // User tries to exceed allowedSlots
  TOOMANYSLOTS = "Max antal slottar bokade",
  // Time has been booked by someone else
  ALREADYBOOKED = "Tidsslot redan bokad, Ladda om sidan"
}

  