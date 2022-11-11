import { UserProfile } from "@auth0/nextjs-auth0";
// Interface to defining our object of response functions
export interface ResponseFuncs {
    GET?: Function
    POST?: Function
    PUT?: Function
    DELETE?: Function
  }
  
  // Type to define our Todo model on the frontend
  export type Booking = {
    _id: number,
    date: Date,
    userName: string
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

  