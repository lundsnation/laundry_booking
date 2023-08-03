// Interface to defining our object of response functions
export interface ResponseFuncs {
  GET?: Function
  POST?: Function
  PUT?: Function
  DELETE?: Function
  PATCH?: Function
}

// Type to define our Todo model on the frontend
// export type Booking = {
//   _id?: string,
//   userName: string,
//   date: Date,
//   timeSlot: string,
// }

export interface ModificationObject {
  [key: string]: any
}

export type JsonBooking = {
  _id?: string,
  userName: string,
  date: string,
  timeSlot: string,
  createdAt?: string,
}

export type TimeSlotType =
  | "07:00-08:30"
  | "08:30-10:00"
  | "10:00-11:30"
  | "11:30-13:00"
  | "13:00-14:30"
  | "14:30-16:00"
  | "16:00-17:30"
  | "17:30-19:00"
  | "19:00-20:30"
  | "20:30-22:00";

// User object, as defined by 
export type UserType = {
  sub?: string,
  user_id?: string,
  name: string,
  email: string,
  connection?: string,
  email_verified?: boolean,
  password?: string,
  app_metadata?: {
    acceptedTerms?: boolean,
    allowedSlots?: number,
    roles?: Array<string>,
    building?: Building
    apartment?: string
  },
  user_metadata?: { telephone?: string },

}

export type UserEdit = {
  email?: string,
  telephone?: string
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
/**
 * Function used for setting the correct time in the booking in DB
 */
//export function timeFromTimeSlot(date: Date, timeSlot: string) {
//  // Aquire date, generates date at 00:00
//  const tempDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
//  const newTime = tempDate.getTime() + convTimes[timeSlots.indexOf(timeSlot)]
//  return new Date(newTime)
//}

/**
 * Array containing the desired timeslots
 */
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

export type Building = Arkivet | "GH" | "NH" | "NYA" | "ARKIVET" | null
type Arkivet = "A" | "B" | "C" | "D"


//Returns an object of type building bsed on inputstring
export function assertBuilding(buildingName: string): Building {
  if (arkivetBuildingNames.indexOf(buildingName) > -1) {
    return "ARKIVET"
  } else if (isBuilding(buildingName)) {
    return buildingName
  }
  return null
}

export const extractBuilding = (name: string): string => (name?.match(/[a-zA-Z]+/) || [])[0] || "";

export const extractAppartment = (name: string): string => (name?.match(/\d+/) || [])[0] || "";

// Manual check is object is of type Building
function isBuilding(obj: any): obj is Building {
  switch (obj) {
    case "ARKIVET":
    case "GH":
    case "NH":
    case "NYA":
      return true;
    default:
      return false;
  }
}
// Lettering of 
const arkivetBuildingNames = ["A", "B", "C", "D"]

// Error messages
export const enum ERROR_MSG {
  // General error
  GENERAL = "Internt fel",
  // User tries to exceed allowedSlots
  TOOMANYSLOTS = "Max antal tider bokade",
  // User tries to book slot in the past
  SLOTINPAST = "Du kan inte boka en tid som passerat",
  // No response for this request
  NOAPIRESPONSE = "Felaktigt anrop",
  // User tried to delete booking that doesn't exist
  NOBOOKING = "Bokningen existerar ej",
  // User is not authorized
  NOTAUTHORIZED = "Du är ej behörig",
  // Error recieved from Auth0 
  AUTH0RESPONSEERROR = "Kunde inte updatera användaren",
  // User needs to add phone number
  NONUMBER = "Lägg till telefonnummer i profil för att kunna göra bokningar.",
  //THe time is already booked
  ALREADY_BOOKED = "Tiden är redan bokad",
}

