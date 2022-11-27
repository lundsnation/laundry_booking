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
        //const bookingYear   = booking.date.getFullYear();
        //const bookingMonth  = booking.date.getMonth();
        //const bookingDay   = booking.date.getDate();

        //const selectedYear = selectedDate.getFullYear();
        //const selectedMonth = selectedDate.getMonth();
        //const selectedDay = selectedDate.getDate();

        //const sameDate = bookingYear == selectedYear && bookingMonth == selectedMonth && bookingDay == selectedDay;
        //console.log("bookingYear, selectedYear : " + bookingYear as string + ", " + selectedYear as string  + " = " + (bookingYear == selectedYear) as string)
        //console.log("bookingMonth, selectedMonth : " + bookingMonth as string + ", " + selectedMonth as string  + " = " + (bookingMonth == selectedMonth) as string)
        //console.log("bookingDay, selectedDay : " + bookingDay as string + ", " +  selectedDay as string  +  (bookingDay == selectedDay) as string)
        //console.log("bookedDate: " + bookingDay + " , " + bookingMonth + " , " + bookingYear)
        //console.log("selectedDate: " + selectedDay + " , " + selectedMonth + " , " + selectedYear)
        //console.log("sameDates : " + sameDate);
        //console.log("timeSlot: " + booking.timeSlot)
       


        const sameDate = compareDates(selectedDate, booking.date);

        if(sameDate) {
            dateBookings.add(booking);
        }
    });

    //console.log(dateBookings.size);
    //console.log("-------------------------------------------------")
    return dateBookings;
}

export const timeSlotToBooking = (bookings: Set<Booking>) => {
    const map: Map<string, Booking> = new Map<string, Booking>();


    bookings.forEach(booking => {
        map.set(booking.timeSlot, booking); 
    });

    return map;
}