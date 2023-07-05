import BookingButton from "./BookingButton";
import { ButtonGroup, AlertColor, SnackbarOrigin } from "@mui/material";
import { UserType } from "../../../../utils/types";
import Bookings from "../../../classes/Bookings";
import Booking from "../../../classes/Booking";
import TimeSlot from "../../../classes/TimeSlot";

interface Props {
    bookedBookings: Bookings;
    timeSlots: TimeSlot[];
    selectedDate: Date;
    user: UserType;
    updateBookings: () => void;
    snackTrigger: (severity: AlertColor, snackString: string, alignment: SnackbarOrigin) => void;
}

const BookingButtonGroup = (props: Props) => {
    const { bookedBookings, timeSlots, selectedDate, user, updateBookings, snackTrigger } = props;
    const buttons = timeSlots.map((timeSlot) => {

        const booking = bookedBookings.find((bookedBooking) => {
            return bookedBooking.hasTimeSlot(timeSlot.getTimeSlot())
        }

        );

        const dryingBoothNbr = timeSlot.getDryingBooth();
        return (
            <BookingButton
                key={timeSlot.toString()}
                timeSlot={timeSlot}
                boothIndex={dryingBoothNbr as number}
                booking={booking || null}
                selectedDate={selectedDate}
                user={user}
                updateBookings={updateBookings}
                snackTrigger={snackTrigger}
            />
        );
    });

    return (
        <ButtonGroup fullWidth size="medium" orientation="vertical">
            {buttons}
        </ButtonGroup>
    );
};

export default BookingButtonGroup;
