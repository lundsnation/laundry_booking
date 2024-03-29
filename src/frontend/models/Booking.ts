import TimeSlot from "./TimeSlot";
import User from "./User";

export type JsonBooking = {
    _id: string,
    user_id: string,
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
    readonly user_id: string


    constructor(jsonBooking: JsonBooking) {
        this._id = jsonBooking._id
        this.username = jsonBooking.username
        this.timeSlot = jsonBooking.timeSlot
        this.dryingBooth = jsonBooking.dryingBooth
        this.laundryBuilding = jsonBooking.laundryBuilding
        this.startTime = new Date(jsonBooking.startTime)
        this.endTime = new Date(jsonBooking.endTime)
        this.createdAt = new Date(jsonBooking.createdAt)
        this.user_id = jsonBooking.user_id
    }

    hasPassed(): boolean {
        return new Date().getTime() > this.startTime.getTime();
    }

    isUserBooking(user: User): boolean {
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

    // Helper methods to format date and time for the calendar

    formatDateForCalendar(date: Date): string {
        // Convert to ISO string, then slice to get the YYYY-MM-DD format
        return date.toISOString().split('T')[0];
    }
    
    formatTimeForCalendar(date: Date, timeZone: string = 'Europe/Stockholm'): string {
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone
        }).format(date);
    }

    get getStartDateAsAddToCal(): string {
        return this.formatDateForCalendar(this.startTime);
    }

    get getEndDateAsAddToCal(): string {
        return this.formatDateForCalendar(this.endTime);
    }

    get getStartTimeAsAddToCal(): string {
        return this.formatTimeForCalendar(this.startTime);
    }

    get getEndTimeAsAddToCal(): string {
        return this.formatTimeForCalendar(this.endTime);
    }
}

export default Booking