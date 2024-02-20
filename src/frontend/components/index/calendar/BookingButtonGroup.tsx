import BookingButton from "./BookingButton";
import {ButtonGroup, AlertColor, SnackbarOrigin} from "@mui/material";
import Booking from "../../../models/Booking";
import Config from "../../../configs/Config";
import User from "../../../models/User";
import TimeSlot from "../../../models/TimeSlot";

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

    const buttons = config.timeSlots.map((ts) => {
        const timeSlot = new TimeSlot(ts, config.getDryingBooth(ts), selectedDate);
        const booking = bookedBookings.find((bookedBooking) => {
                return bookedBooking.hasTimeSlot(timeSlot)
            }
        );

        return (
            <BookingButton
                key={timeSlot.toString()}
                timeSlot={timeSlot}
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
