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
import { dateFromTimeSlot } from '../../utils/bookingsAPI';
import { Booking, UserType } from '../../utils/types';


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
    timeSlot: string;
    booking: Booking | null;
    selectedDate: Date;
    user: UserType;
    handleOpenConfirmation: (open: boolean) => void;
    snackTrigger: (severity: AlertColor, snackString: string, alignment: SnackbarOrigin) => void;
}

export const ConfirmBooking = (props: Props) => {
    //const [open, setOpen] = React.useState(false);
    const { myTimeSlot, booking, selectedDate, timeSlot, user, open, handleOpenConfirmation, snackTrigger } = props;
    const snackAlignment: SnackbarOrigin = { vertical: 'bottom', horizontal: 'left' }
    const date = new Date(dateFromTimeSlot(selectedDate, timeSlot))
    let snackString;


    const handleBook = async () => {
        //setDisabled(true)

        const jsonBooking = { userName: (user.name as string), date: date, timeSlot: timeSlot, createdAt: new Date() }
        const response = await fetch("/api/bookings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(jsonBooking)
        });
        if (response.ok) {
            snackString = "Du har bokat: " + String(timeSlot)
            snackTrigger("success", snackString, snackAlignment)
        } else {
            let responseContent = await response.json()
            snackString = responseContent.error
            snackTrigger("error", snackString, snackAlignment)
        }

        handleOpenConfirmation(false);
        //setDisabled(false)
    }

    const handleCancel = async () => {
        const api_url = "/api/bookings" + "/" + (booking?._id);
        const jsonBooking = { userName: (user.name as string), date: date, timeSlot: timeSlot, createdAt: new Date() }
        const response = await fetch(api_url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(jsonBooking)
        });

        //updateBookings();
        if (response.ok) {
            snackString = "Du har avbokat tiden"
            snackTrigger("success", snackString, snackAlignment)
        } else {
            let responseContent = await response.json()
            snackString = responseContent.error
            snackTrigger("error", snackString, snackAlignment)
        }

        handleOpenConfirmation(false);
    }

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
                    <Typography component={'span'} variant={'body2'}>
                        {date.toLocaleString('sv-SE', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </Typography>
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