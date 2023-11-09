import {JsonBooking, TimeSlotType} from "../../utils/types";
import TimeSlot from "./TimeSlot";
import TimeSlots from "./TimeSlots";

class Booking {
    public _id?: string;
    public userName: string;
    public date: Date;
    public timeSlot: TimeSlot;
    public createdAt?: Date;

    constructor(userName: string, date: Date, timeSlot: TimeSlot, _id?: string, createdAt?: Date) {
        this._id = _id;
        this.userName = userName;
        this.date = date;
        this.timeSlot = timeSlot;
        this.createdAt = createdAt;
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
        return this.timeSlot.getTimeSlot().toString() === timeSlot.getTimeSlot().toString();
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

    async POST(): Promise<Response> {
        const jsonBooking = JSON.stringify(this.toJSON());

        try {
            const response = await fetch("/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: jsonBooking
            });
            return response;
        } catch (error) {
            console.error("Error creating booking:", error);
            throw error;
        }
    }

    async DELETE(): Promise<Response> {
        const api_url = "/api/bookings" + "/" + this._id;
        try {
            const response = await fetch(api_url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(this.toJSON())
            });

            return response;
        } catch (error) {
            console.error("Error canceling booking:", error);
            throw error;
        }
    }

    toJSON(): JsonBooking {
        const {_id, userName, date, timeSlot} = this;

        return {
            _id: _id,
            userName: userName,
            date: timeSlot.toDate(date).toISOString(),
            timeSlot: timeSlot.toString(),
            createdAt: new Date().toISOString(),
        }
    }

    static fromJSON(json: JsonBooking): Booking {
        const {_id, userName, date, timeSlot} = json;
        const dryingBooth = TimeSlots.TIME_SLOT_TO_DRYING_BOOTH.get(timeSlot as TimeSlotType) as number;
        const tmpDate = new Date(date);
        return new Booking(userName, tmpDate, new TimeSlot(timeSlot as TimeSlotType, dryingBooth, tmpDate), _id);
    }
}

export default Booking