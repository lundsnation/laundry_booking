import { Button } from "@mui/material"
import { useState } from "react";

interface Props {
    title: String;
    status: boolean;
}



const BookingButton = (props: Props) => {
    const [bookedStatus, setBookedStatus] = useState<boolean>(false);

    const handleClick = () => {
        setBookedStatus(!bookedStatus);
    }

    return (
        <Button onClick={handleClick}> {props.title} </Button>
    );
};