import { NextPage } from "next";
import BookingCalendar from '../src/components/BookingCalendar';

const Calendar: NextPage = () => {
    return(
        <BookingCalendar title="Tvättbokning - Lunds Nation"/>
    );
}

export default Calendar;