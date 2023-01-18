import { Button, Paper, AlertColor, Grid, IconButton, Typography, Box, SnackbarOrigin, Fade, Tooltip } from "@mui/material"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import React, { useEffect, useState } from "react";
import { Booking, timeFromTimeSlot } from "../../../utils/types"
import BookingInfo from "./BookingInfo"
import { UserType } from "../../../utils/types";
import { dateFromTimeSlot } from "../../../utils/bookingsAPI";
import ConfirmBooking from "../ConfirmBooking";

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
    const { boothIndex, user, booking, selectedDate, timeSlot, updateBookings, snackTrigger } = props
    const [disabled, setDisabled] = useState<boolean>(false)
    const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
    const [showBookingInfo, setShowBookingInfo] = useState<boolean>(false)
    const [bookingUser, setBookingUser] = useState<UserType>({} as UserType)
    const [loadingUser, setLoadingUser] = useState(false)
    const bookedTimeSlot = booking != null;
    const myTimeSlot = user.name == booking?.userName ? bookedTimeSlot : null;
    const snackAlignment: SnackbarOrigin = { vertical: 'bottom', horizontal: 'left' }
    const timeSlotDate = dateFromTimeSlot(selectedDate, timeSlot)
    const timeSlotHasPassed = new Date().getTime() > timeSlotDate.getTime()
    let snackString;

    useEffect(() => {
        setDisabled(timeSlotHasPassed)
    }, [timeSlotHasPassed]);


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
        } else {
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

    const handleOpenConfirmation = (open: boolean) => {
        setOpenConfirmation(open);
    }





    //Alla fall behövs egentligen inte då disabled knappar inte resulterar i tooltip
    let title = ""
    if (myTimeSlot) {
        title = "Tryck för att avboka tiden"
    } else if (bookedTimeSlot && !myTimeSlot) {
        title = "Tiden är bokad av någon annan."
    } else if (!bookedTimeSlot) {
        title = "Tryck för att boka tiden"
    } else {
        title = "Tiden har passerat"
    }


    return (
        <div>
            <ConfirmBooking
                open={openConfirmation}
                myTimeSlot={myTimeSlot}
                timeSlot={timeSlot}
                booking={booking}
                selectedDate={selectedDate}
                user={user}
                handleOpenConfirmation={handleOpenConfirmation}
                snackTrigger={snackTrigger}
            />

            <Grid container spacing={1}>

                <Grid item xs={2} md={1}></Grid>
                <Grid item xs={8} md={10}>

                    <Paper elevation={0} >
                        <Tooltip
                            title={title}
                            placement={"right"}
                        >
                            <Button
                                fullWidth
                                size="small"
                                variant="contained"
                                onClick={() => handleOpenConfirmation(true)}
                                color={!bookedTimeSlot ? 'primary' : 'secondary'}
                                disabled={(bookedTimeSlot && !myTimeSlot) || disabled}
                            >
                                <Grid container >
                                    <Grid item xs={7} >
                                        <Typography variant="button" align="left">{timeSlot}</Typography>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Typography variant="button" align="left" sx={{ textTransform: "none" }}>Bås {" " + boothIndex}</Typography>
                                    </Grid>

                                </Grid>
                            </Button>
                        </Tooltip>
                    </Paper>
                </Grid>
                <Grid item xs={2} md={1}>
                    <IconButton disabled={!(bookedTimeSlot && !myTimeSlot)}
                        onClick={() => { setShowBookingInfo(true) }}
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
        </div>
    );
};

export default BookingButton;
