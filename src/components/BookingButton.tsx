import { Button, Container, Snackbar, Alert } from "@mui/material"
import { UserProfile } from "@auth0/nextjs-auth0";
import { useState } from "react";
import {Booking, BUTTON_STATES, ERROR_MSG} from "../../utils/types"
import {conv} from "../../utils/conv"
import { post, del} from "../../utils/actions";

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
    const [showDebookedSnack, setDebookedSnack] = useState<boolean>(false);
    const [showFailSnack, setFailSnack] = useState<boolean>(false);
    const [errorString, seterrorString] = useState<string>(ERROR_MSG.GENERAL);

    // Function for booking time
    const bookTime = async () =>{
        setButtonState(BUTTON_STATES.UNAVAILIBLE)
        let response = await post(props.index, props.user, props.converter)
        if(!response){
            seterrorString(ERROR_MSG.TOOMANYSLOTS)
            setFailSnack(true)
            setButtonState(BUTTON_STATES.AVAILIBLE)
            return 
        }
        setLocalID(response._id)
        setButtonState(BUTTON_STATES.EDITABLE)
        setSucessSnack(true)
    }
    // Function for deleting already aquired time
    const deleteTime =  async () => {
        setButtonState(BUTTON_STATES.UNAVAILIBLE)
        let response = await del(localID,props.user)
        if(!response){
            seterrorString(ERROR_MSG.GENERAL)
            setFailSnack(true)
            setButtonState(BUTTON_STATES.EDITABLE)
            return
        }
        setButtonState(BUTTON_STATES.AVAILIBLE)
        setDebookedSnack(true)
    }

    function resetSnack(){
        setSucessSnack(false)
        setDebookedSnack(false)
        setFailSnack(false)
    }

    return (
        <Container maxWidth={false}>
            <Button onClick={(buttonState == BUTTON_STATES.AVAILIBLE) ? bookTime : deleteTime} color = {buttonState == BUTTON_STATES.AVAILIBLE ? 'primary' : 'secondary'} disabled = {buttonState===BUTTON_STATES.UNAVAILIBLE} variant="outlined" size = "large"> {props.time} </Button>
            <Snackbar open={showSucessSnack} autoHideDuration={3000} onClose = {resetSnack}>
                <Alert severity="success"  sx={{ width: '100%' }}>Tid Bokad : {props.time}</Alert>
            </Snackbar>
            <Snackbar open={showDebookedSnack} autoHideDuration={3000} onClose = {resetSnack}>
                <Alert severity="info"  sx={{ width: '100%' }}>Tid Avbokad : {props.time}</Alert>
            </Snackbar>
            <Snackbar open={showFailSnack} autoHideDuration={3000} onClose = {resetSnack}>
                <Alert severity="error"  sx={{ width: '100%' }}>{errorString}</Alert>
            </Snackbar>
        </Container>
    );
};

export default BookingButton;