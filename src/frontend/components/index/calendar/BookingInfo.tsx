import React, {useState, useEffect} from "react";
import {
    Dialog,
    DialogTitle,
    DialogActions,
    List,
    ListItem,
    Typography,
    Button,
    Divider,
    Skeleton,
    Grid
} from "@mui/material";
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import CallIcon from '@mui/icons-material/Call';
import Booking from "../../../models/Booking";
import {UserBookingInfo} from "../../../models/User";
import BackendAPI from "../../../../apiHandlers/BackendAPI";
import useAsyncError from "../../../errorHandling/asyncError";
import {isAxiosError} from "axios";

interface Props {
    booking: Booking;
    showBookingInfo: boolean;
    setShowBookingInfo: (state: boolean) => void;
}

const initUserBookingInfo = {
    name: "",
    email: "",
    user_metadata: {
        telephone: "",
    }
}

const BookingInfo: React.FC<Props> = ({booking, showBookingInfo, setShowBookingInfo}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<UserBookingInfo>(initUserBookingInfo);
    const throwAsyncError = useAsyncError();

    useEffect(() => {
        const showBookedTime = async () => {
            try {
                if (showBookingInfo) {
                    setLoading(true);

                    const fetchedUser = await BackendAPI.fetchUserBookingInfo(booking.user_id)
                    setUserInfo((oldUserInfo: UserBookingInfo) => ({
                        ...oldUserInfo,
                        email: fetchedUser.email,
                        name: fetchedUser.name,
                        user_metadata: {
                            telephone: fetchedUser.user_metadata.telephone,
                        },
                    }));

                    setLoading(false);
                }
            } catch (e) {
                //This will be caught by the ErrorBoundary. Can be tweaked to use more specific error messages.
                // For example the error itself can be thrown or information from it.
                if (isAxiosError(e)) {
                    throwAsyncError(e);
                } else {
                    throwAsyncError(new Error("An error occurred while fetching user info"));
                }
            }
        };

        showBookedTime();
    }, [showBookingInfo, booking.user_id, throwAsyncError]);


    return (
        <Dialog onClose={() => setShowBookingInfo(false)} open={showBookingInfo} fullWidth>
            <DialogTitle>Bokningsinformation</DialogTitle>
            <Divider variant="middle"/>
            <List>
                <ListItem>
                    Booked by &nbsp;{loading ? <Skeleton width={80}/> :
                    <Typography style={{fontWeight: 'bold'}}>{userInfo.name}</Typography>}
                </ListItem>
                <ListItem>
                    <CallIcon fontSize="small"/>  &nbsp; {loading ? <Skeleton width={150}/> :
                    <Typography style={{paddingLeft: 5}}>{userInfo.user_metadata.telephone}</Typography>}
                </ListItem>
                <ListItem>
                    <AlternateEmailIcon fontSize="small"/>  &nbsp; {loading ? <Skeleton width={150}/> :
                    <Typography style={{paddingLeft: 5}}>{userInfo.email}</Typography>}
                </ListItem>
            </List>
            <DialogActions>
                <Grid container padding={2}>
                    <Grid item xs={8}>
                        <Typography sx={{fontStyle: "italic"}} variant="caption">Kom ihåg att hålla god ton mot andra
                            hyrestagare.</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Button onClick={() => setShowBookingInfo(false)}>Close</Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    );
};

export default BookingInfo;
