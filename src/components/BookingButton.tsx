import { Button, Container, Snackbar, Alert } from "@mui/material"
import { UserProfile } from "@auth0/nextjs-auth0";
import { useState } from "react";
import {Booking, BUTTON_STATES} from "../../utils/types"
import {conv} from "../../utils/conv"

const N_TIMESLOTS = 10
const MIN_H = 7
const MAX_H = 22

interface Props {
    time: string;
    status: Booking;
    user: UserProfile;
    converter: conv;
    index: number;
}
const BookingButton = (props: Props) => {
    // Checking if the supplied timeslot is the users booking
    const status = props.status
    let initState = BUTTON_STATES.UNAVAILIBLE
    let initID = 0;
    if(status != null){
        if(status.userName == props.user.name){
            initState = BUTTON_STATES.EDITABLE
            initID = status._id
        }
    }else{
        initState = BUTTON_STATES.AVAILIBLE
    }
    const [buttonState, setButtonState] = useState<number>(initState);
    const [localID, setLocalID] = useState<number>(initID)
    const [showSucessSnack, setSucessSnack] = useState<boolean>(false);
    // Function for booking time
    const bookTime =  async () => {   
        const bookingDate = props.converter.getDate(props.index);
        const bookingResponse = {date: bookingDate, userName: props.user.name}
        const response = await fetch("/api/bookings", {
            method: "POST",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify(bookingResponse)
        });
        const ans = await response.json()
        setLocalID(ans._id)
        setButtonState(BUTTON_STATES.EDITABLE)
        setSucessSnack(true)
    }
    // Function for deleting already aquired time
    const deleteTime =  async () => {
        const id = localID
        const res = "/api/bookings/" + id
        const response = await fetch(res, {
            method: "DELETE"
        });
        const data = await response.json();
        setButtonState(BUTTON_STATES.AVAILIBLE)

    }
    function resetSnack(){
        setSucessSnack(false)
    }

    return (
        <Container maxWidth="lg">
            <Button onClick={(buttonState == BUTTON_STATES.AVAILIBLE) ? bookTime : deleteTime} color = {buttonState == BUTTON_STATES.AVAILIBLE ? 'primary' : 'secondary'} disabled = {buttonState===BUTTON_STATES.UNAVAILIBLE} variant="contained"  > {props.time} </Button>
            <Snackbar open={showSucessSnack} autoHideDuration={3000} onClose = {resetSnack}>
                <Alert severity="success" color ='success' sx={{ width: '100%' }}>Tid Bokad : {props.time}</Alert>
            </Snackbar>
        </Container>
    );
};

export default BookingButton;