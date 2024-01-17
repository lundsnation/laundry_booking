// Type to define our Todo model on the frontend
// export type MongooseBooking = {
//   _id?: string,
//   userName: string,
//   date: Date,
//   timeSlot: string,
// }


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


export type UserEdit = {
    email?: string,
    telephone?: string
}

export type Building = Arkivet | "GH" | "NH" | "NYA" | "ARKIVET" | null
type Arkivet = "A" | "B" | "C" | "D"
