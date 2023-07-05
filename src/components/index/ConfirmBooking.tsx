import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper, { PaperProps } from '@mui/material/Paper';
import Draggable from 'react-draggable';
import { AlertColor, Divider, SnackbarOrigin, Typography } from '@mui/material';
import { UserType } from '../../../utils/types';
import Booking from '../../classes/Booking';
import TimeSlot from '../../classes/TimeSlot';


function PaperComponent(props: PaperProps) {
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} />
        </Draggable>
    );
}


interface Props {
    open: boolean;
    myTimeSlot: boolean | null,
    timeSlot: TimeSlot;
    booking: Booking | null;
    date: Date;
    user: UserType;
    handleOpenConfirmation: (open: boolean) => void;
    snackTrigger: (severity: AlertColor, snackString: string, alignment: SnackbarOrigin) => void;
}

export const ConfirmBooking = (props: Props) => {
    //const [open, setOpen] = React.useState(false);
    const { myTimeSlot, booking, date, timeSlot, user, open, handleOpenConfirmation, snackTrigger } = props;
    const snackAlignment: SnackbarOrigin = { vertical: 'bottom', horizontal: 'left' }
    let snackString;

    const handleBook = async () => {
        //setDisabled(true)
        const booking = new Booking(user.name as string, date, timeSlot);

        try {
            const response = await booking.POST();

            if (response.ok) {
                snackString = "Du har bokat: " + String(timeSlot);
                snackTrigger("success", snackString, snackAlignment);
            } else {
                const responseContent = await response.json();
                snackString = responseContent.error;
                console.log(snackString)
                snackTrigger("error", snackString, snackAlignment);
            }
        } catch (error) {
            console.error("Error creating booking:", error);
            // Handle any errors during the POST request
            snackString = "An error occurred while creating booking";
            snackTrigger("error", snackString, snackAlignment);
        }

        handleOpenConfirmation(false);
        //setDisabled(false)
    };


    const handleCancel = async () => {
        if (!booking) return;

        try {
            const response = await booking.DELETE();

            if (response.ok) {
                snackString = "Du har avbokat tiden";
                snackTrigger("success", snackString, snackAlignment);
            } else {
                let responseContent = await response.json();
                snackString = responseContent.error;
                snackTrigger("error", snackString, snackAlignment);
            }
        } catch (error) {
            console.error("Error canceling booking:", error);
            snackString = "An error occurred while canceling booking";
            snackTrigger("error", snackString, snackAlignment);
        }

        handleOpenConfirmation(false);
    };


    return (
        <Dialog
            open={open}
            onClose={() => handleOpenConfirmation(false)}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
        >
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                Bekräfta
                <Divider />
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Är du säker på att du vill {!myTimeSlot ? "boka" : "avboka"} tiden?
                    <br />
                    {date.toLocaleString('sv-SE', { year: 'numeric', month: 'numeric', day: 'numeric' }) + ", " + timeSlot}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    fullWidth
                    autoFocus
                    variant={"outlined"}
                    onClick={() => handleOpenConfirmation(false)}
                    color={'warning'}
                >
                    Avbryt
                </Button>
                <Button
                    fullWidth
                    variant={"outlined"}
                    onClick={myTimeSlot ? handleCancel : handleBook}
                    color={myTimeSlot ? 'error' : 'primary'}
                > {myTimeSlot ? "Avboka" : "Boka"} </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmBooking;