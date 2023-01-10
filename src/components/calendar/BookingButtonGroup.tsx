import BookingButton from "./BookingButton";
import ButtonGroup from '@mui/material/ButtonGroup';
import { useEffect, useState } from "react";
import { AlertColor, Box, Container, SnackbarOrigin, Fade } from "@mui/material"
import { Booking, UserType } from "../../../utils/types"
import { timeSlotToBooking, timeSlotToDryingBooth } from "../../../utils/bookingsAPI";

interface Props {
    bookedBookings: Set<Booking>;
    timeSlots: Array<string>;
    selectedDate: Date;
    user: UserType;
    updateBookings: () => void;
    snackTrigger: (severity: AlertColor, snackString: string, alignment: SnackbarOrigin) => void;
}

const BookingButtonGroup = (props: Props) => {
    const { bookedBookings, timeSlots, selectedDate, user, updateBookings, snackTrigger } = props
    const [ready,setReady] = useState(false)
    const timeToBooking: Map<string, Booking> = timeSlotToBooking(bookedBookings);

    const timeToDryingBooth: Map<string, number> = timeSlotToDryingBooth(timeSlots);

    useEffect(()=>{
        if(!ready){
            setReady(true)
        }
    },[bookedBookings])

    const buttons = timeSlots.map(timeSlot => {
        let booking: null | Booking = null;
        if (timeToBooking.has(timeSlot)) {
            booking = timeToBooking.get(timeSlot) as Booking;
        }

        const dryingBoothNbr = timeSlotToDryingBooth.get(timeSlot);

        return <BookingButton
            key={timeSlot}
            timeSlot={timeSlot}
            boothIndex={dryingBoothNbr as number}
            booking={booking != null ? booking : null}
            selectedDate={selectedDate}
            user={user}
            updateBookings={updateBookings}
            snackTrigger={snackTrigger}
        />
    });
    
    return (
        <Fade in={ready}>
        <ButtonGroup sx={{ zIndex: 'modal' }} fullWidth size='medium' orientation='vertical'> {buttons} </ButtonGroup>
        </Fade>
    );
}

export default BookingButtonGroup;