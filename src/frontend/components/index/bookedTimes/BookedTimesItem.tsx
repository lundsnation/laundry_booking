import React, {useState} from "react";
import {
    AlertColor,
    Box,
    Fade,
    ListItem,
    SnackbarOrigin,
    Stack,
    Typography,
    useMediaQuery
} from "@mui/material";
import ConfirmBooking from "../ConfirmBooking";
import {LoadingButton} from "@mui/lab";
import Booking from "../../../models/Booking";
import User from "../../../models/User";
import TimeSlot from "../../../models/TimeSlot";
import DateUtils from "../../../utils/DateUtils";
import {AddToCalendarButton} from 'add-to-calendar-button-react';
import theme from "../../../theme";


interface Props {
    userBooking: Booking,
    user: User,
    snackTrigger: (severity: AlertColor, snackString: string, alignment: SnackbarOrigin) => void
}

const BookedTimesItem = (props: Props) => {
    const {userBooking, user, snackTrigger} = props;
    const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
    const userBookingString = DateUtils.toLaundryBookingString(userBooking.startTime, userBooking.timeSlot.toString());
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

            <Box sx={{margin: '8px'}}>
                <ListItem sx={{border: '1px solid #ccc', borderRadius: '4px'}}>
                    <Fade in={true}>
                        <Stack direction={'row'} spacing={1} alignItems="center" width="100%">
                            <Typography variant={isMobile ? "caption" : "button"} sx={{flex: 1}}>
                                {userBookingString}
                            </Typography>
                            <AddToCalendarButton
                                name="Tvättid"
                                size={"2|1"}
                                startDate={userBooking.getStartDateAsAddToCal}
                                startTime={userBooking.getStartTimeAsAddToCal}
                                endDate={userBooking.getEndDateAsAddToCal}
                                endTime={userBooking.getEndTimeAsAddToCal}
                                listStyle="modal"
                                hideBackground={true}
                                buttonStyle="default"
                                lightMode="light"
                                language="sv"
                                options={['Apple', 'Google', 'iCal']}
                                timeZone="Europe/Stockholm"
                            />
                            <LoadingButton
                                onClick={() => handleOpenConfirmation(true)}
                                variant="outlined"
                                color="error"
                                size="small"
                                sx={{fontSize: '0.8rem'}}
                            >
                                <Typography variant="body2">Avboka</Typography>
                            </LoadingButton>
                        </Stack>
                    </Fade>
                </ListItem>
            </Box>
        </React.Fragment>
    )
}

export default BookedTimesItem;