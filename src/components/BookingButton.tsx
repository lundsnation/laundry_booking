import { Button, Container, Snackbar, Alert } from "@mui/material"
import { UserProfile } from "@auth0/nextjs-auth0";
import { useState } from "react";
import {Booking} from "../../utils/types"

interface Props {
    user: UserProfile;
    booking: Booking | null;
    selectedDate: Date;
    timeSlot: string;
    updateBookings: () => void;
}
const BookingButton = (props: Props) => {
    // Checking if the supplied timeslot is the users booking
    const booking = props.booking;
    const selectedDate = props.selectedDate;
    const timeSlot = props.timeSlot;
    const user = props.user;
    const updateBookings = props.updateBookings;
    const bookedTimeSlot = booking != null;
    const myTimeSlot =  user.name == booking?.userName ? bookedTimeSlot : null;
    const [successfullBooking, setsuccessfullBooking] = useState(false);
    const [sucessfullCancellation, setSucessfullCancellation] = useState(false);

    //let successfullBooking = false;
    //let sucessfullCancellation = false;
    // Function for booking time
    const handleBook =  async () => {   
        //const bookingDate = props.converter.getDate(props.index);
        //console.log("Running handleBook in bookingButton");
        //console.log("Selected Date: " + selectedDate);
        //console.log("timeSlot : " + timeSlot);
        //console.log("User name : " + user.name);
        
        const jsonBooking = { userName : (user.name as string), date :  new Date(selectedDate), timeSlot: timeSlot }
        const response = await fetch("/api/bookings", {
            method: "POST",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify(jsonBooking)
        });
        const ans = await response
        //console.log(ans)
        if(ans.ok){
            setsuccessfullBooking(true);
        }
        updateBookings();        
    }

    // Function for deleting already aquired time
    const handleCancel =  async () => {
        const api_url = "/api/bookings" + "/" + (booking?._id);
        const response = await fetch(api_url, {
            method: "DELETE",
        });
        const data = await response.json();
        setSucessfullCancellation(true);
        updateBookings();
    }

    function resetSnack() {
        setSucessfullCancellation(false);
        setsuccessfullBooking(false);
    }

    return (
        <Container maxWidth="lg">
            <Button onClick={bookedTimeSlot && myTimeSlot ? handleCancel : handleBook } color = {!bookedTimeSlot ? 'primary' : 'secondary'} disabled = {bookedTimeSlot && !myTimeSlot} variant="contained"  > {props.timeSlot} </Button>
            <Snackbar open={successfullBooking} autoHideDuration={3000} onClose = {resetSnack}>
                <Alert severity="success" color ='success' sx={{ width: '100%' }}> Tid Bokad : {props.timeSlot}</Alert>
            </Snackbar>
            <Snackbar open={sucessfullCancellation} autoHideDuration={3000} onClose = {resetSnack}>
                <Alert severity="success" color ='info' sx={{ width: '100%' }}> Tid Avbokad : {props.timeSlot}</Alert>
            </Snackbar>
        </Container>

        
    );
};

export default BookingButton;