import { Building, JsonBooking } from "../../utils/types";

class Booking {
    private _id?: string;
    public userName: string;
    public building: Building;
    public date: Date;
    public timeSlot: string;

    constructor(userName: string, building: Building, date: Date, timeSlot: string, _id?: string) {
        this._id = _id;
        this.userName = userName;
        this.building = building;
        this.date = date;
        this.timeSlot = timeSlot;
    }

    hasPassed(): boolean {
        return new Date().getTime() > this.date.getTime();
    }

    isUserBooking(userName: string): boolean {
        return this.userName === userName;
    }

    isSameDate(date: Date): boolean {
        const bookingYear = this.date.getFullYear();
        const bookingMonth = this.date.getMonth();
        const bookingDay = this.date.getDate();

        const selectedYear = date.getFullYear();
        const selectedMonth = date.getMonth();
        const selectedDay = date.getDate();

        const sameDate = bookingYear == selectedYear && bookingMonth == selectedMonth && bookingDay == selectedDay;
        return sameDate;
    }

    static fromJSON(json: JsonBooking): Booking {
        const { _id, userName, building, date, timeSlot } = json;
        return new Booking(userName, building, new Date(date), timeSlot, _id);
    }

}

export default Booking