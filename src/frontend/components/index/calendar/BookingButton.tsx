import React, {useState} from "react";
import {Button, Paper, Grid, IconButton, Typography, Tooltip, AlertColor, SnackbarOrigin} from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import BookingInfo from "./BookingInfo";
import ConfirmBooking from "../ConfirmBooking";
import Booking from "../../../models/Booking";
import TimeSlot from "../../../models/TimeSlot";
import User from "../../../models/User";

interface Props {
    user: User;
    booking: Booking | null;
    selectedDate: Date;
    timeSlot: TimeSlot;
    updateBookings: () => void;
    snackTrigger: (severity: AlertColor, snackString: string, alignment: SnackbarOrigin) => void;
}

const BookingButton = ({user, booking, selectedDate, timeSlot, snackTrigger}: Props) => {
    const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
    const [showBookingInfo, setShowBookingInfo] = useState<boolean>(false);
    const isAdmin = user.app_metadata.roles.includes("admin");

    const isUserBooking = booking && booking.isUserBooking(user);
    const isTimeSlotBooked = Boolean(booking);
    const isTimeSlotUpcoming = !timeSlot.hasPassed();
    const canAdminUnbook = isAdmin && booking;

    let title = "";

    if (isTimeSlotUpcoming) {
        if (isUserBooking || canAdminUnbook) {
            title = "Tryck för att avboka tiden"; // "Press to cancel the time slot"
        } else if (!isTimeSlotBooked) {
            title = "Tryck för att boka tiden"; // "Press to book the time slot"
        } else {
            title = "Tiden är bokad av annan hyresgäst."; // "The time slot is booked by another tenant."
        }
    } else {
        title = "Tiden har passerat"; // "The time has passed"
    }

    const shouldDisableButton = (isTimeSlotBooked && !isUserBooking && !isAdmin) || !isTimeSlotUpcoming;

    const handleOpenConfirmation = (open: boolean) => {
        setOpenConfirmation(open);
    };

    return (
        <Grid container alignItems={'center'}>
            <ConfirmBooking
                open={openConfirmation}
                myTimeSlot={isUserBooking}
                timeSlot={timeSlot}
                booking={booking}
                date={selectedDate}
                user={user}
                handleOpenConfirmation={handleOpenConfirmation}
                snackTrigger={snackTrigger}
            />

            <Grid item xs={1} md={1}></Grid>

            <Grid item xs={10} md={10}>
                <Tooltip title={title} placement={"right"}>
                    <Paper>
                        <span> {/* Tooltip hack for disabled buttons */}
                            <Button
                                fullWidth
                                size="small"
                                sx={{height: {xs: 45, sm: '33.45px'}, borderRadius: 0}}
                                variant="contained"
                                onClick={() => handleOpenConfirmation(true)}
                                color={!isTimeSlotBooked ? 'primary' : 'secondary'}
                                disabled={shouldDisableButton}
                            >
                                <Grid container>
                                    <Grid item xs={7}>
                                        <Typography variant="button" align="left">
                                            {timeSlot.toString()}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Typography variant="button" align="left" sx={{textTransform: "none"}}>
                                            Bås {" " + timeSlot.dryingBooth}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Button>
                        </span>
                    </Paper>
                </Tooltip>
            </Grid>

            <Grid item xs={1} md={1} pl={0.5}>
                <Tooltip title={'Tryck för att visa info om bokning'} placement={'right'}>
                    <span>
                        <IconButton
                            onClick={() => setShowBookingInfo(true)}
                            style={{height: 33.4, width: 20}}
                        >
                            {isTimeSlotBooked && !isUserBooking ? <InfoOutlinedIcon color="action"/> : null}
                        </IconButton>
                    </span>
                </Tooltip>

                {booking &&
                    <BookingInfo
                        showBookingInfo={showBookingInfo}
                        booking={booking}
                        setShowBookingInfo={setShowBookingInfo}
                    />
                }
            </Grid>
        </Grid>
    );
};

export default BookingButton;
