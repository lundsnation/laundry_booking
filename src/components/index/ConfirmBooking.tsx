import * as React from 'react';
import {
    Button, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, Divider, Paper, PaperProps, AlertColor, SnackbarOrigin
} from '@mui/material';
import Draggable from 'react-draggable';
import Booking from '../../classes/Booking';
import TimeSlot from '../../classes/TimeSlot';
import User from "../../classes/User";
import BackendAPI from "../../apiHandlers/BackendAPI";
import DateUtils from "../../../utils/DateUtils";

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

    const bookTimeSlot = async () => {
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
    };

    const cancelBooking = async () => {
        if (!booking) return;

        await BackendAPI.deleteBooking(booking._id);
        snackTrigger("success", "Du har avbokat tiden", snackAlignment);
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
                <Button fullWidth autoFocus variant="outlined" onClick={() => handleOpenConfirmation(false)}
                        color="warning">
                    Avbryt
                </Button>
                <Button fullWidth variant="outlined" onClick={handleAction} color={actionButtonColor}>
                    {getActionButtonText()}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmBooking;
