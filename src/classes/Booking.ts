export type JsonBooking = {
    _id: string,
    userName: string,
    timeSlot: string
    dryingBooth: number
    startTime: string
    endTime: string
    createdAt: string
    laundryBuilding: string,
}

class Booking {
    readonly _id: string
    readonly userName: string
    readonly timeSlot: string
    readonly dryingBooth: number
    readonly startTime: Date
    readonly endTime: Date
    readonly createdAt: Date
    readonly laundryBuilding: string


    constructor(jsonBooking: JsonBooking) {
        this._id = jsonBooking._id
        this.userName = jsonBooking.userName
        this.timeSlot = jsonBooking.timeSlot
        this.dryingBooth = jsonBooking.dryingBooth
        this.startTime = new Date(jsonBooking.startTime)
        this.endTime = new Date(jsonBooking.endTime)
        this.createdAt = new Date(jsonBooking.createdAt)
        this.laundryBuilding = jsonBooking.laundryBuilding
    }

    hasPassed(): boolean {
        return new Date().getTime() > this.startTime.getTime();
    }

    isUserBooking(userName: string): boolean {
        return this.userName === userName;
    }

    hasTimeSlot(timeSlot: string): boolean {
        return this.timeSlot === timeSlot;
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