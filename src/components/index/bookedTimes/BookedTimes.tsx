import React from "react";
import { Card, Box, Grid, Divider, AlertColor, Typography, List, ListItem, SnackbarOrigin } from "@mui/material";
import { Booking, UserType } from "../../../../utils/types";
import BookedTimesItem from "./BookedTimesItem";


interface Props {
    userBookings: Array<Booking>,
    user: UserType,
    snackTrigger: (severity: AlertColor, snackString: string, alignment: SnackbarOrigin) => void
}

const BookedTimes = (props: Props) => {
    const { userBookings, user, snackTrigger } = props;



    const bookedTimesItems = userBookings.map((booking, idx) => {
        return (
            userBookings.length ?
                <BookedTimesItem
                    key={booking.date.toString() + idx}
                    userBooking={booking}
                    user={user}
                    snackTrigger={snackTrigger}
                /> :
                <ListItem>
                    <Typography variant="subtitle2" >
                        Du har inga bokade tider
                    </Typography>
                </ListItem>
        )
    });


    return (
        <Card variant={"outlined"}>
            <Box >
                <Grid container alignItems="center">
                    <Grid item xs={12}>
                        <Typography variant="body1" sx={{ fontWeight: "bold" }} component="div" margin={2}>
                            Dina Bokade Tider:
                        </Typography>
                        <Divider variant="middle" />
                    </Grid>
                    <Grid container direction="column" height={150} sx={{ overflow: 'auto' }}>
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