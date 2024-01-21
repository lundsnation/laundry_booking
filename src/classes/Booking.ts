import user from "./User";
import TimeSlot from "./TimeSlot";

export type JsonBooking = {
    _id: string,
    username: string,
    timeSlot: string
    dryingBooth: number
    laundryBuilding: string,
    startTime: string
    endTime: string
    createdAt: string
}

export type NewBooking = Omit<JsonBooking, '_id'>;

class Booking {
    readonly _id: string
    readonly username: string
    readonly timeSlot: string
    readonly dryingBooth: number
    readonly laundryBuilding: string
    readonly startTime: Date
    readonly endTime: Date
    readonly createdAt: Date


    constructor(jsonBooking: JsonBooking) {
        this._id = jsonBooking._id
        this.username = jsonBooking.username
        this.timeSlot = jsonBooking.timeSlot
        this.dryingBooth = jsonBooking.dryingBooth
        this.laundryBuilding = jsonBooking.laundryBuilding
        this.startTime = new Date(jsonBooking.startTime)
        this.endTime = new Date(jsonBooking.endTime)
        this.createdAt = new Date(jsonBooking.createdAt)
    }

    hasPassed(): boolean {
        return new Date().getTime() > this.startTime.getTime();
    }

    isUserBooking(User: user): boolean {
        return this.username === user.name;
    }

    hasTimeSlot(timeSlot: TimeSlot): boolean {
        return this.timeSlot === timeSlot.toString();
    }

    isSameDay(otherDate: Date): boolean {
        const bookingYear = this.startTime.getFullYear();
        const bookingMonth = this.startTime.getMonth();
        const bookingDay = this.startTime.getDate();

        const otherYear = otherDate.getFullYear();
        const otherMonth = otherDate.getMonth();
        const otherDay = otherDate.getDate();

        return bookingYear === otherYear && bookingMonth === otherMonth && bookingDay === otherDay;
    }
}

export default Booking