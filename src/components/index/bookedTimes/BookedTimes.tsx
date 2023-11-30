import React from "react";
import {Card, Box, Grid, Divider, AlertColor, Typography, List, ListItem, SnackbarOrigin} from "@mui/material";
import BookedTimesItem from "./BookedTimesItem";
import Booking from "../../../classes/Booking";
import User from "../../../classes/User";


interface Props {
    activeUserBookings: Booking[],
    user: User,
    snackTrigger: (severity: AlertColor, snackString: string, alignment: SnackbarOrigin) => void
}

const BookedTimes = ({activeUserBookings, user, snackTrigger}: Props) => {
    console.log("Active user bookings:", activeUserBookings)

    const bookedTimesItems = activeUserBookings.map((booking, idx) => {
        return (
            activeUserBookings.length ?
                <BookedTimesItem
                    key={booking.startTime.toString() + idx}
                    userBooking={booking}
                    user={user}
                    snackTrigger={snackTrigger}
                /> :
                <ListItem>
                    <Typography variant="subtitle2">
                        Du har inga bokade tider
                    </Typography>
                </ListItem>
        )
    });

    return (
        <Card variant={"outlined"}>
            <Box>
                <Grid container alignItems="center">
                    <Grid item xs={12}>
                        <Typography variant="body1" sx={{fontWeight: "bold"}} component="div" margin={2}>
                            Dina Bokade Tider:
                        </Typography>
                        <Divider variant="middle"/>
                    </Grid>
                    <Grid container direction="column" height={150} sx={{overflow: 'auto'}}>
                        <List>
                            {bookedTimesItems}
                        </List>
                    </Grid>
                </Grid>
            </Box>
        </Card>
    )
}
export default BookedTimes;