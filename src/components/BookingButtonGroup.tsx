import BookingButton from "./BookingButton";
import ButtonGroup from '@mui/material/ButtonGroup';
import { useState } from "react";


interface Props {
    times: Array<string>
    selectedDate: Date;
}

const BookingButtonGroup = (props: Props) => {
    const [bookedTimes, setBookedTimes] = useState<Array<string>>([]);

    

    const times = props.times;
    const buttons = times.map(time => {
        return <BookingButton key={time} time={time}/>
    });

    return(
        <ButtonGroup> {buttons} </ButtonGroup>     
    );
}

export default BookingButtonGroup;