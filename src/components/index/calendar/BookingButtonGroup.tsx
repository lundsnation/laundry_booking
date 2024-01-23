import BookingButton from "./BookingButton";
import {ButtonGroup, AlertColor, SnackbarOrigin} from "@mui/material";
import Booking from "../../../classes/Booking";
import Config from "../../../configs/Config";
import User from "../../../classes/User";
import TimeSlot from "../../../classes/TimeSlot";

interface Props {
    bookedBookings: Booking[];
    selectedDate: Date;
    user: User;
    updateBookings: () => void;
    snackTrigger: (severity: AlertColor, snackString: string, alignment: SnackbarOrigin) => void;
    config: Config;
}

const BookingButtonGroup = (props: Props) => {
    const {bookedBookings, selectedDate, user, updateBookings, snackTrigger, config} = props;

    const buttons = config.timeSlots.map((timeSlot) => {
        const booking = bookedBookings.find((bookedBooking) => {
                return bookedBooking.hasTimeSlot(timeSlot)
            }
        );

        return (
            <BookingButton
                key={timeSlot.toString()}
                timeSlot={new TimeSlot(timeSlot, config.getDryingBooth(timeSlot), selectedDate)}
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
