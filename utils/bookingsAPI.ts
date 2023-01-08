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

//This function needs to be changed if the mappings fron timeSlots -> Drying booths change.
export const timeSlotToDryingBooth = (timeSlots: Array<string>) => {
    const map: Map<string, number> = new Map<string, number>();

    timeSlots.forEach((timeSlot, idx)=> {
        map.set(timeSlot, (idx+1));
    })

    return map;
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
        const strDate = booking.date.getFullYear().toString() + ":" + booking.date.getMonth().toString() + ":" +  booking.date.getDay().toString();

        const strDateExists = map.has(strDate)

        if(!strDateExists) {
            map.set(strDate, 1);
        } else {
            map.set(strDate, (map.get(strDate) as number) + 1);
        }
    })

    return map;
}