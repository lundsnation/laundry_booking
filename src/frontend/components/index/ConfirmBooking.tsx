import * as React from 'react';
import {
    Button, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, Divider, Paper, PaperProps, AlertColor, SnackbarOrigin
} from '@mui/material';
import Draggable from 'react-draggable';
import Booking from '../../models/Booking';
import TimeSlot from '../../models/TimeSlot';
import User from "../../models/User";
import BackendAPI from "../../../apiHandlers/BackendAPI";
import DateUtils from "../../utils/DateUtils";
import useAsyncError from "../../errorHandling/asyncError";
import {isAxiosError} from "axios";
import {useState} from "react";
import {LoadingButton} from "@mui/lab";

function PaperComponent(props: PaperProps) {
    return (
        <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}

interface Props {
    open: boolean;
    myTimeSlot: boolean | null;
    timeSlot: TimeSlot;
    booking: Booking | null;
    date: Date;
    user: User;
    handleOpenConfirmation: (open: boolean) => void;
    snackTrigger: (severity: AlertColor, snackString: string, alignment: SnackbarOrigin) => void;
}

const ConfirmBooking = ({
                            myTimeSlot,
                            booking,
                            timeSlot,
                            open,
                            handleOpenConfirmation,
                            snackTrigger,
                            user
                        }: Props) => {
    const snackAlignment: SnackbarOrigin = {vertical: 'bottom', horizontal: 'left'};
    const isAdmin = user.app_metadata.roles.includes("admin");
    const throwAsyncError = useAsyncError();
    const [loading, setLoading] = useState<boolean>(false);

    const bookTimeSlot = async () => {
        setLoading(true);
        try {
            await BackendAPI.postBooking({
                user_id: user.sub,
                username: user.name,
                timeSlot: timeSlot.toString(),
                dryingBooth: timeSlot.dryingBooth,
                laundryBuilding: user.app_metadata.laundryBuilding,
                startTime: timeSlot.startTime.toISOString(),
                endTime: timeSlot.endTime.toISOString(),
                createdAt: new Date().toISOString(),
            });
            snackTrigger("success", `Du har bokat: ${timeSlot}`, snackAlignment);
        } catch (e) {
            if (isAxiosError(e)) {
                console.log("Error in dis", e)
                // Hack to propagate the error to the ErrorBoundary and display the error message
                throwAsyncError(new Error("Något gick fel när du skulle boka tiden - " + e.response?.data.error));
            }
        } finally {
            setLoading(false);
        }
    };

    const cancelBooking = async () => {
        if (!booking) return;
        setLoading(true);

        try {
            await BackendAPI.deleteBooking(booking._id);
            snackTrigger("success", "Du har avbokat tiden", snackAlignment);
        } catch (e) {
            //This will be caught by the ErrorBoundary. Can be tweaked to use more specific error messages.
            // For example the error itself can be thrown or information from it.
            console.log(e)
            throwAsyncError(new Error("Något gick fel när du skulle avboka tiden. Försök igen."));
        } finally {
            setLoading(false);
        }
    };

    const handleAction = () => {
        const action = (myTimeSlot || isAdmin) && booking ? cancelBooking : bookTimeSlot;
        action().then(() => handleOpenConfirmation(false));
    };

    const getDialogText = () => {
        if (isAdmin && booking && !myTimeSlot) {
            return `Är du säker på att du vill avboka tiden för ${booking.username}?`;
        } else if (myTimeSlot) {
            return "Är du säker på att du vill avboka tiden?";
        } else {
            return "Är du säker på att du vill boka tiden?";
        }
    };

    const getActionButtonText = () => {
        return (myTimeSlot || (isAdmin && booking)) ? "Avboka" : "Boka";
    };

    const actionButtonColor = (myTimeSlot || (isAdmin && booking)) ? 'error' : 'primary';

    return (
        <Dialog
            open={open}
            onClose={() => handleOpenConfirmation(false)}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
        >
            <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
                Bekräfta
                <Divider/>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {getDialogText()}
                    <br/>
                    {DateUtils.toLaundryBookingString(timeSlot.startTime, timeSlot.toString(), timeSlot.dryingBooth)}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button fullWidth autoFocus variant="outlined"
                        onClick={() => handleOpenConfirmation(false)}
                        color="warning">
                    Avbryt
                </Button>
                <LoadingButton loading={loading} fullWidth variant="outlined" onClick={handleAction}
                               color={actionButtonColor}>
                    {getActionButtonText()}
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmBooking;
