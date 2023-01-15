import { Booking } from "./types"

export const compareDates = (d1: Date, d2: Date): boolean => {
    const bookingYear = d1.getFullYear();
    const bookingMonth = d1.getMonth();
    const bookingDay = d1.getDate();

    const selectedYear = d2.getFullYear();
    const selectedMonth = d2.getMonth();
    const selectedDay = d2.getDate();

    const sameDate = bookingYear == selectedYear && bookingMonth == selectedMonth && bookingDay == selectedDay;
    return sameDate;
}


export const getDateBookings = (bookings: Array<Booking>, selectedDate: Date) => {
    const dateBookings: Set<Booking> = new Set();
    bookings.forEach(booking => {

        const sameDate = compareDates(selectedDate, booking.date);

        if (sameDate) {
            dateBookings.add(booking);
        }
    });
    return dateBookings;
}

//This function needs to be changed if the mappings fron timeSlots -> Drying booths change.

export const timeSlotToDryingBooth = new Map([
    ["07:00-08:30", 1],
    ["08:30-10:00", 2],
    ["10:00-11:30", 3],
    ["11:30-13:00", 4],
    ["13:00-14:30", 5],
    ["14:30-16:00", 6],
    ["16:00-17:30", 7],
    ["17:30-19:00", 8],
    ["19:00-20:30", 9],
    ["20:30-22:00", 10]
]
)




export const timeSlotToTime = new Map([
    ["07:00-08:30", 25200000],
    ["08:30-10:00", 30600000],
    ["10:00-11:30", 36000000],
    ["11:30-13:00", 39600000],
    ["13:00-14:30", 46800000],
    ["14:30-16:00", 52200000],
    ["16:00-17:30", 57600000],
    ["17:30-19:00", 63000000],
    ["19:00-20:30", 68400000],
    ["20:30-22:00", 73800000]
]
)

export const dateFromTimeSlot = (date: Date, timeSlot: string) => {
    // Aquire date, generates date at 00:00
    const tempDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const newTime = tempDate.getTime() + (timeSlotToTime.get(timeSlot) as number);
    return new Date(newTime)
}

//The method timeSlotToBooking and and dateToNbrOfBookingsMap can be combined for further optimization.
//By combining them, both maps can be created in one iteration instead of two. And since they are both created
//in bookingCalendar, it is actually unnecessary to create them in two separate methods and loops  
export const timeSlotToBooking = (bookings: Set<Booking>) => {
    const map: Map<string, Booking> = new Map<string, Booking>();


    bookings.forEach(booking => {
        map.set(booking.timeSlot, booking);
    });

    return map;
}

export const dateToNbrOfBookingsMap = (bookings: Array<Booking>) => {
    const map: Map<string, number> = new Map<string, number>();

    bookings.forEach(booking => {
        const strDate = booking.date.getFullYear().toString() + ":" + booking.date.getMonth().toString() + ":" + booking.date.getDay().toString();

        const strDateExists = map.has(strDate)

        if (!strDateExists) {
            map.set(strDate, 1);
        } else {
            map.set(strDate, (map.get(strDate) as number) + 1);
        }
    })

    return map;
}