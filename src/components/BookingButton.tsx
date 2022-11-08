import { Button, Container } from "@mui/material"
import { time } from "console";
import { useEffect, useState } from "react";
import {Booking, ResponseFuncs} from "../../utils/types"
import {conv} from "../../utils/conv"
const N_TIMESLOTS = 10
const MIN_H = 7
const MAX_H = 22

interface Props {
    time: String;
    status: boolean;
    index: number;
    date: Date;
}
const BookingButton = (props: Props) => {
    const [booked, setBooked] = useState<boolean>(props.status);
    let buttonColor: string = "success";
    
    const  handleClick =  async () => {
        
        const d = props.date
        const converter = new conv(MIN_H,MAX_H,N_TIMESLOTS,d);
        const sentDate = converter.getDate(props.index);
        const bookingResponse = {date: sentDate,building:"NH",tenant:"1111"}// as Booking
        const response = await fetch("/api/bookings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bookingResponse)
        });
        const data = await  response.json();

        setBooked(!booked);
    }

    return (
            <Button  onClick={handleClick} disabled = {booked} color={booked ?  "secondary" : "primary"} variant="contained" sx={ { borderRadius: 3 , border: 1, p: -1} } > {props.time} </Button>
    );
};

export default BookingButton;