import { Button, Container } from "@mui/material"
import { time } from "console";
import { useEffect, useState } from "react";
import {Booking, ResponseFuncs} from "../../utils/types"

interface Props {
    time: String;
    //status: boolean;
}




const BookingButton = (props: Props) => {
    const [booked, setBooked] = useState<boolean>(false);
    let buttonColor: string = "success";

    /*
    useEffect(() => {
        color = booked ? color = "error" : color = "success";
    }, [booked]);
    */
    

    const  handleClick =  async () => {
        const response = await fetch("/api/bookings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        });
        const data = await  response.json();

        setBooked(!booked);
    }

    return (
            <Button onClick={handleClick} color={booked ?  "error" : "success"} variant="outlined" > {props.time} </Button>
    );
};

export default BookingButton;