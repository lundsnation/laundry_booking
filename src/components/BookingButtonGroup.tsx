import BookingButton from "./BookingButton";
import ButtonGroup from '@mui/material/ButtonGroup';
import { useState } from "react";
import {Booking} from "../../utils/types"
import { UserProfile } from "@auth0/nextjs-auth0";
import {conv} from "../../utils/conv"


interface Props {
    times: Array<string>
    selectedDate: Date
    booked: Array<Booking>
    user: UserProfile
    converter: conv
}

const BookingButtonGroup = (props: Props) => {
    const times = props.times;
    const booked = props.booked;
    props.converter.setDate(props.selectedDate);

    const buttons = times.map((time,index) => {
        return <BookingButton key={time} time={time} status={booked[index]} user = {props.user} converter ={props.converter} index = {index}/>
    });


    return(
        <ButtonGroup orientation = 'vertical'> {buttons}  </ButtonGroup>     
    );
}

export default BookingButtonGroup;