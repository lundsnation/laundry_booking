import React, { useState } from "react";
import { AlertColor, Button, ButtonGroup, Fade, ListItem, SnackbarOrigin, Typography } from "@mui/material";
import ConfirmBooking from "./ConfirmBooking";
import { LoadingButton } from "@mui/lab";
import { Booking, UserType } from "../../utils/types";
import { timeSlotToDryingBooth } from "../../utils/bookingsAPI";

interface Props {
    userBooking: Booking,
    user: UserType,
    snackTrigger: (severity: AlertColor, snackString: string, alignment: SnackbarOrigin) => void
}

const BookedTimesItem = (props: Props) => {
    const { userBooking, user, snackTrigger } = props;
    const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } as const;
    const userBookingString = userBooking.date.toLocaleDateString('sv-SE', options).replaceAll(" ", ", ") + ", " + userBooking.timeSlot + ", Torkbås: " + timeSlotToDryingBooth.get(userBooking.timeSlot);

    const handleOpenConfirmation = (open: boolean) => {
        setOpenConfirmation(open);
    }

    return (
        <React.Fragment>
            <ConfirmBooking
                open={openConfirmation}
                timeSlot={userBooking.timeSlot}
                myTimeSlot={true}
                booking={userBooking}
                date={userBooking.date}
                user={user}
                handleOpenConfirmation={handleOpenConfirmation}
                snackTrigger={snackTrigger}
            />

            <ListItem >
                <Fade in={true}>
                    <ButtonGroup variant="outlined" fullWidth>
                        <Button disabled fullWidth sx={{ textTransform: 'none' }}>
                            <Typography variant="body2" sx={{ color: "black" }}>
                                {userBookingString}
                            </Typography>
                        </Button>
                        <LoadingButton
                            onClick={() => handleOpenConfirmation(true)}
                            variant="outlined"
                            color="error"
                            sx={{ width: "35%" }} >
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