import React, {useState} from "react";
import {AlertColor, Button, ButtonGroup, Fade, ListItem, SnackbarOrigin, Typography} from "@mui/material";
import ConfirmBooking from "../ConfirmBooking";
import {LoadingButton} from "@mui/lab";
import Booking from "../../../classes/Booking";
import User from "../../../classes/User";
import TimeSlot from "../../../classes/TimeSlot";
import DateUtils from "../../../utils/DateUtils";

interface Props {
    userBooking: Booking,
    user: User,
    snackTrigger: (severity: AlertColor, snackString: string, alignment: SnackbarOrigin) => void
}

const BookedTimesItem = (props: Props) => {
    const {userBooking, user, snackTrigger} = props;
    const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
    const userBookingString = DateUtils.toLaundryBookingString(userBooking.startTime, userBooking.timeSlot.toString(), userBooking.dryingBooth)

    const handleOpenConfirmation = (open: boolean) => {
        setOpenConfirmation(open);
    }

    return (
        <React.Fragment>
            <ConfirmBooking
                open={openConfirmation}
                timeSlot={new TimeSlot(userBooking.timeSlot, userBooking.dryingBooth, userBooking.startTime)}
                myTimeSlot={true}
                booking={userBooking}
                date={userBooking.startTime}
                user={user}
                handleOpenConfirmation={handleOpenConfirmation}
                snackTrigger={snackTrigger}
            />

            <ListItem>
                <Fade in={true}>
                    <ButtonGroup variant="outlined" fullWidth>
                        <Button disabled fullWidth sx={{textTransform: 'none'}}>
                            <Typography variant="body2" sx={{color: "black"}}>
                                {userBookingString}
                            </Typography>
                        </Button>
                        <LoadingButton
                            onClick={() => handleOpenConfirmation(true)}
                            variant="outlined"
                            color="error"
                            sx={{width: "35%"}}>
                            <Typography variant="body2">
                                Avboka
                            </Typography>
                        </LoadingButton>
                    </ButtonGroup>
                </Fade>
            </ListItem>
        </React.Fragment>
    )
}

export default BookedTimesItem;