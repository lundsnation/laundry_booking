import BookingButton from "./BookingButton";
import ButtonGroup from '@mui/material/ButtonGroup';
import { useState } from "react";
import {Booking} from "../../utils/types"
import { UserProfile } from "@auth0/nextjs-auth0";
import { BookOnlineSharp } from "@mui/icons-material";
import { timeSlotToBooking } from "../../utils/bookingsAPI";


interface Props {
    bookedBookings: Set<Booking>;
    timeSlots: Array<string>;
    selectedDate: Date;
    user: UserProfile;
    

    updateBookings: () => void;
}

const BookingButtonGroup = (props: Props) => {
    const timeSlots = props.timeSlots;
    const selectedDate = props.selectedDate;
    const bookedBookings = props.bookedBookings;
    const updateBookings = props.updateBookings;
    const user = props.user;
    
    const timeToBooking: Map<string, Booking> = timeSlotToBooking(bookedBookings);

    const buttons = timeSlots.map(timeSlot => {
        let booking: null | Booking = null;
        
        if(timeToBooking.has(timeSlot)) {
            //console.log("bookBooking in timeSlot : " + timeSlot )
            booking = timeToBooking.get(timeSlot) as Booking;
        }

        return <BookingButton key = { timeSlot } timeSlot = { timeSlot } booking = { booking != null ? booking : null } selectedDate = { selectedDate } user = { user }  updateBookings = {updateBookings}  />
    });
        //Kan vara fel här
     

    return(
        <ButtonGroup orientation = 'vertical'> {buttons}  </ButtonGroup>     
    );
}

export default BookingButtonGroup;