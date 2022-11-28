import { Booking } from "./types"

export const compareDates = (d1: Date, d2: Date): boolean => {
    const bookingYear   = d1.getFullYear();
    const bookingMonth  = d1.getMonth();
    const bookingDay   = d1.getDate();

    const selectedYear = d2.getFullYear();
    const selectedMonth = d2.getMonth();
    const selectedDay = d2.getDate();

    const sameDate = bookingYear == selectedYear && bookingMonth == selectedMonth && bookingDay == selectedDay;
    return sameDate;
}


export const getDateBookings = (bookings: Array<Booking>, selectedDate: Date ) => {
    const dateBookings: Set<Booking> = new Set();
    bookings.forEach(booking => {

        const sameDate = compareDates(selectedDate, booking.date);

        if(sameDate) {
            dateBookings.add(booking);
        }
    });
    return dateBookings;
}

export const timeSlotToBooking = (bookings: Set<Booking>) => {
    const map: Map<string, Booking> = new Map<string, Booking>();


    bookings.forEach(booking => {
        map.set(booking.timeSlot, booking); 
    });

    return map;
}