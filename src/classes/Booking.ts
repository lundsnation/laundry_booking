import TimeSlot from "./TimeSlot";

export type JsonBooking = {
    _id: string,
    userName: string,
    date: string,
    timeSlot: string,
    createdAt: string
}

export type newBooking = {
    userName: string,
    date: Date,
    timeSlot: string
    createdAt: Date
}

class Booking {
    readonly _id: string;
    readonly userName: string;
    readonly date: Date;
    readonly timeSlot: string; //ändra till TimeSlot
    readonly createdAt: Date;

    constructor(booking: JsonBooking) {
        this._id = booking._id;
        this.userName = booking.userName;
        this.date = new Date(booking.date);
        this.timeSlot = booking.timeSlot;
        this.createdAt = new Date(booking.createdAt);
    }

    hasPassed(): boolean {
        return new Date().getTime() > this.date.getTime();
    }

    get building(): string {
        const building = this.userName.replace(/[^a-zA-Z]/g, "")
        if (["A", "B", "C", "D"].includes(building)) return "ARKIVET"
        if (["NH", "GH", "admin"].includes(building)) return "NATIONSHUSET"
        return "UNKNOWN";
    }

    isUserBooking(userName: string): boolean {
        return this.userName === userName;
    }

    hasTimeSlot(timeSlot: TimeSlot): boolean {
        return this.timeSlot.toString() === timeSlot.getTimeSlot().toString();
    }

    isSameDate(date: Date): boolean {
        const bookingYear = this.date.getFullYear();
        const bookingMonth = this.date.getMonth();
        const bookingDay = this.date.getDate();

        const selectedYear = date.getFullYear();
        const selectedMonth = date.getMonth();
        const selectedDay = date.getDate();

        return bookingYear == selectedYear && bookingMonth == selectedMonth && bookingDay == selectedDay;
    }
}

export default Booking