import BookingButton from "./BookingButton";
import ButtonGroup from '@mui/material/ButtonGroup';
import { useState } from "react";
import {fetchTimes} from "../../utils/fetchTimes"


interface Props {
    times: Array<string>
    selectedDate: Date;
    booked: Array<boolean>
}

const BookingButtonGroup = (props: Props) => {

    const times = props.times;
    const booked = props.booked;
    const buttons = times.map((time,index) => {
        return <BookingButton key={time} time={time} status={booked[index]} index = {index} date = {props.selectedDate}/>
    });


    return(
        <ButtonGroup orientation = 'vertical'> {buttons}  </ButtonGroup>     
    );
}

export default BookingButtonGroup;