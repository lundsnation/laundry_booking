import { Button, Container, AlertColor, Grid, IconButton, Typography, Box, SnackbarOrigin } from "@mui/material"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import React, { useState } from "react";
import { Booking, timeFromTimeSlot } from "../../../utils/types"
import BookingInfo from "./BookingInfo"
import { timeSlots } from "../../../utils/types";
import { UserType } from "../../../utils/types";
import { textTransform } from "@mui/system";

interface Props {
    //user: UserProfile;
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
    const [bookingUser, setBookingUser] = useState<UserType>({} as UserType)
    const [loadingUser, setLoadingUser] = useState(false)
    const { user, booking, selectedDate, timeSlot, updateBookings, snackTrigger } = props
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

    const showBookedTime = async () => {

        if (!showBookingInfo) {

            setLoadingUser(true)
            setShowBookingInfo(!showBookingInfo);
            const response = await fetch("/api/user/" + booking?.userName)
            if (response.ok) {
                try {
                    const responseContent = await response.json()
                    setBookingUser({ ...responseContent })
                } catch (error) {
                    console.log(error)
                }
            }
            setLoadingUser(false)
            return
        }
        setShowBookingInfo(!showBookingInfo);
    }

    return (
        <Grid container>
            <Grid item xs={12}>
                <Button
                    sx={{
                        minWidth: "100",
                        minHeight: { xs: 50, md: 0 },
                        maxHeight: "33.6px",
                        textTransform: "none",
                        fontSize: { xs: 20, md: 14 },
                    }}
                    onClick={bookedTimeSlot && myTimeSlot ? handleCancel : handleBook}
                    color={!bookedTimeSlot ? 'primary' : 'secondary'}
                    disabled={(bookedTimeSlot && !myTimeSlot) || disabled} variant="contained"

                >

                    {props.timeSlot}

                </Button>
            </Grid>
            {/* <Grid container xs={3} justifyContent="center">
                <IconButton disabled={!(bookedTimeSlot && !myTimeSlot)} onClick={() => { showBookedTime() }} style={{ padding: 0, height: 20, width: 20, marginBottom: "-8px" }}>
                    {(bookedTimeSlot && !myTimeSlot) ?
                        <InfoOutlinedIcon color="action" fontSize="small" />
                        : null}
                </IconButton>
                {booking && <BookingInfo
                    showBookingInfo={showBookingInfo}
                    showBookedTime={showBookedTime}
                    booking={booking}
                    user={bookingUser}
                    loading={loadingUser}
                />}
            </Grid> */}
        </Grid >

    );
};

export default BookingButton;