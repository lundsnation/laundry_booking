import {Button, Paper, AlertColor, Grid, IconButton, Typography, SnackbarOrigin, Tooltip} from "@mui/material"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import React, {useState} from "react";
import BookingInfo from "./BookingInfo"
import ConfirmBooking from "../ConfirmBooking";
import Booking from "../../../classes/Booking";
import TimeSlot from "../../../classes/TimeSlot";
import User from "../../../classes/User";

interface Props {
    user: User;
    booking: Booking | null;
    selectedDate: Date;
    timeSlot: TimeSlot;
    updateBookings: () => void;
    snackTrigger: (severity: AlertColor, snackString: string, alignment: SnackbarOrigin) => void;
}

const BookingButton = (props: Props) => {
    const {user, booking, selectedDate, timeSlot, snackTrigger} = props
    const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
    const [showBookingInfo, setShowBookingInfo] = useState<boolean>(false)

    const handleOpenConfirmation = (open: boolean) => {
        setOpenConfirmation(open);
    }


    const myTimeSlot = booking && booking.isUserBooking(user.name)
    let title = ""
    if (myTimeSlot && !timeSlot.hasPassed()) {
        title = "Tryck för att avboka tiden"
    } else if (booking && !myTimeSlot) {
        title = "Tiden är bokad av annan hyresgäst."
    } else if (!booking && !timeSlot.hasPassed()) {
        title = "Tryck för att boka tiden"
    } else {
        title = "Tiden har passerat"
    }

    return (
        <Grid container alignItems={'center'}>
            <ConfirmBooking
                open={openConfirmation}
                myTimeSlot={myTimeSlot}
                timeSlot={timeSlot}
                booking={booking}
                date={selectedDate}
                user={user}
                handleOpenConfirmation={handleOpenConfirmation}
                snackTrigger={snackTrigger}
            />

            <Grid item xs={1} md={1}></Grid>

            <Grid item xs={10} md={10}>
                <Tooltip
                    title={title}
                    placement={"right"}
                >
                    {/*The span is a hack to enable tooltip on disabled buttons*/}
                    {/*The sx height is also a hack to make the buttongroup same size as calendar vertically*/}
                    <Paper>
                        <span>
                            <Button
                                fullWidth
                                size="small"
                                sx={{height: {xs: 45, sm: '33.45px'}, borderRadius: 0}}
                                variant="contained"
                                onClick={() => handleOpenConfirmation(true)}
                                color={!booking ? 'primary' : 'secondary'}
                                disabled={(booking && !myTimeSlot) || timeSlot.hasPassed()}
                            >
                                <Grid container>
                                    <Grid item xs={7}>
                                        <Typography variant="button" align="left">{timeSlot.toString()}</Typography>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Typography variant="button" align="left"
                                                    sx={{textTransform: "none"}}>Bås {" " + timeSlot.getDryingBooth()}</Typography>
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
                            onClick={() => {
                                setShowBookingInfo(true)
                            }}
                            style={{height: 33.4, width: 20}}
                        >
                            {
                                (booking && !myTimeSlot) ? <InfoOutlinedIcon color="action"/> : null
                            }
                        </IconButton>
                    </span>
                </Tooltip>

                {
                    booking &&
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
