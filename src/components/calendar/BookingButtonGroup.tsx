import BookingButton from "./BookingButton";
import ButtonGroup from '@mui/material/ButtonGroup';

import { AlertColor, Container, SnackbarOrigin } from "@mui/material"
import { Booking,UserType } from "../../../utils/types"
import { timeSlotToBooking } from "../../../utils/bookingsAPI";

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
    const timeToBooking: Map<string, Booking> = timeSlotToBooking(bookedBookings);
    const buttons = timeSlots.map(timeSlot => {
        let booking: null | Booking = null;
        if (timeToBooking.has(timeSlot)) {
            booking = timeToBooking.get(timeSlot) as Booking;
        }

        return <BookingButton 
        key={timeSlot} 
        timeSlot={timeSlot} 
        booking={booking != null ? booking : null} 
        selectedDate={selectedDate}
        user={user} 
        updateBookings={updateBookings} 
        snackTrigger={snackTrigger} 
        />
    });
    //Kan vara fel här


    return (
        // <ButtonGroup  orientation='vertical'> {buttons}  </ButtonGroup>
        <Container disableGutters>
            {buttons}
        </Container>
        
    );
}

export default BookingButtonGroup;