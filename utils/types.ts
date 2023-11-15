// Type to define our Todo model on the frontend
// export type MongooseBooking = {
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
    // No response for this request
    NOAPIRESPONSE = "Felaktigt anrop",
    // User is not authorized
    NOTAUTHORIZED = "Du är ej behörig",
    // Error recieved from Auth0
    AUTH0RESPONSEERROR = "Kunde inte updatera användaren",
    // User needs to add phone number
}

