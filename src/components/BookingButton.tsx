import { Button, Container, AlertColor, Alert } from "@mui/material"
import { UserProfile } from "@auth0/nextjs-auth0";
import { useState } from "react";
import { Booking, timeFromTimeSlot } from "../../utils/types"

interface Props {
    user: UserProfile;
    booking: Booking | null;
    selectedDate: Date;
    timeSlot: string;
    updateBookings: () => void;
    snackTrigger: (severity: AlertColor, snackString: string) => void;
}
const BookingButton = (props: Props) => {
    // Checking if the supplied timeslot is the users booking
    const [disabled, setDisabled] = useState<boolean>(false)
    const { user, booking, selectedDate, timeSlot, updateBookings, snackTrigger } = props
    const bookedTimeSlot = booking != null;
    let snackString;
    const myTimeSlot = user.name == booking?.userName ? bookedTimeSlot : null;
    // Function for booking time
    const handleBook = async () => {
        setDisabled(true)
        const date = new Date(timeFromTimeSlot(selectedDate, timeSlot))
        const jsonBooking = { userName: (user.name as string), date: date, timeSlot: timeSlot }
        const response = await fetch("/api/bookings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(jsonBooking)
        });
        updateBookings();
        if (response.ok) {
            snackString = "Du har bokat: " + String(timeSlot)
            snackTrigger("success", snackString)
        } else if (response.status == 400) {
            snackString = "Du kan inte boka flera tider"
            snackTrigger("error", snackString)
        } else if (response.status == 406) {
            snackString = "Du kan inte boka tider som redan varit"
            snackTrigger("error", snackString)
        }
        setDisabled(false)

    }

    // Function for deleting already aquired time
    const handleCancel = async () => {
        const api_url = "/api/bookings" + "/" + (booking?._id);
        const response = await fetch(api_url, {
            method: "DELETE",
        });
        updateBookings();
        if (response.ok) {
            snackString = "Du har avbokat tiden"
            snackTrigger("success", snackString)
        } else {
            snackString = "Internt fel"
            snackTrigger("error", snackString)
        }
    }

    return (
        <Container maxWidth="lg">
            <Button style={{ maxWidth: "120px", minWidth: "120px" }} onClick={bookedTimeSlot && myTimeSlot ? handleCancel : handleBook} color={!bookedTimeSlot ? 'primary' : 'secondary'} disabled={(bookedTimeSlot && !myTimeSlot) || disabled} variant="contained"  > {props.timeSlot} </Button>
        </Container >


    );
};

export default BookingButton;