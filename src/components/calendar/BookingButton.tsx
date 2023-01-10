import { Button, Paper, AlertColor, Grid, IconButton, Typography, Box, SnackbarOrigin, Fade } from "@mui/material"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import React, { useEffect, useState } from "react";
import { Booking, timeFromTimeSlot } from "../../../utils/types"
import BookingInfo from "./BookingInfo"
import { UserType } from "../../../utils/types";

interface Props {
    boothIndex: number,
    user: UserType;
    booking: Booking | null;
    selectedDate: Date;
    timeSlot: string;
    updateBookings: () => void;
    snackTrigger: (severity: AlertColor, snackString: string, alignment: SnackbarOrigin) => void;
}
const BookingButton = (props: Props) => {
    const [disabled, setDisabled] = useState<boolean>(false)
    const [showBookingInfo, setShowBookingInfo] = useState<boolean>(false)
    const { boothIndex,user, booking, selectedDate, timeSlot, updateBookings, snackTrigger } = props
    const bookedTimeSlot = booking != null;
    const myTimeSlot = user.name == booking?.userName ? bookedTimeSlot : null;
    let snackString;
    const snackAlignment: SnackbarOrigin = { vertical: 'bottom', horizontal: 'left' }

    // Function for booking time
    const handleBook = async () => {
        setDisabled(true)
        const date = new Date(timeFromTimeSlot(selectedDate, timeSlot))
        const jsonBooking = { userName: (user.name as string), date: date, timeSlot: timeSlot, createdAt: new Date() }
        const response = await fetch("/api/bookings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(jsonBooking)
        });
        if (response.ok) {
            snackString = "Du har bokat: " + String(timeSlot)
            snackTrigger("success", snackString, snackAlignment)
        } else{
            let responseContent = await response.json()
            snackString = responseContent.error
            snackTrigger("error", snackString, snackAlignment)
        } 
        setDisabled(false)
    }
    // Function for deleting already aquired time
    const handleCancel = async () => {
        const api_url = "/api/bookings" + "/" + (booking?._id);
        const date = new Date(timeFromTimeSlot(selectedDate, timeSlot))
        const jsonBooking = { userName: (user.name as string), date: date, timeSlot: timeSlot, createdAt: new Date() }
        const response = await fetch(api_url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(jsonBooking)
        });

        //updateBookings();
        if (response.ok) {
            snackString = "Du har avbokat tiden"
            snackTrigger("success", snackString, snackAlignment)
        } else {
            let responseContent = await response.json()
            snackString = responseContent.error
            snackTrigger("error", snackString, snackAlignment)
        }
    }
    // Function for showing info on booked time

    return (
        <Grid container spacing={1}>
            <Grid item xs={1}></Grid>
            <Grid item xs={10}>
                
            <Paper elevation={0} >
                <Button
                    fullWidth
                    size="small"
                    variant="contained"
                    onClick={bookedTimeSlot && myTimeSlot ? handleCancel : handleBook}
                    color={!bookedTimeSlot ? 'primary' : 'secondary'}
                    disabled={(bookedTimeSlot && !myTimeSlot) || disabled} 
                    >

                        <Grid container >
                            <Grid item xs={7} >
                                <Typography variant="button" align="left">{timeSlot}</Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Typography variant="button" align="left" sx={{textTransform:"none"}}>Bås {" "+ boothIndex}</Typography>
                            </Grid>
                        </Grid>
                </Button>
                </Paper>
            </Grid>
            <Grid item xs={1}> 
                <IconButton disabled={!(bookedTimeSlot && !myTimeSlot)} 
                            onClick={() => {setShowBookingInfo(true)}} 
                            style={{ padding: 0, height: 20, width: 20, marginBottom: "-8px" }}>
                    {(bookedTimeSlot && !myTimeSlot) ?
                        <InfoOutlinedIcon color="action" />
                        : null}
                </IconButton>
                {booking && <BookingInfo
                    showBookingInfo={showBookingInfo}
                    booking={booking}
                    setShowBookingInfo={setShowBookingInfo}
                />}
        </Grid >
        </Grid>
    );
};

export default BookingButton;