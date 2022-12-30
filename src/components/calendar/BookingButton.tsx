import { Button, Container, AlertColor, Grid, IconButton, Typography,Box } from "@mui/material"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import React, { useState } from "react";
import { Booking, timeFromTimeSlot } from "../../../utils/types"
import BookingInfo from "./BookingInfo"
import { timeSlots } from "../../../utils/types";
import { UserType } from "../../../utils/types";

interface Props {
    user: UserType;
    booking: Booking | null;
    selectedDate: Date;
    timeSlot: string;
    updateBookings: () => void;
    snackTrigger: (severity: AlertColor, snackString: string) => void;
}
const BookingButton = (props: Props) => {
    const [disabled, setDisabled] = useState<boolean>(false)
    const [showBookingInfo,setShowBookingInfo] = useState<boolean>(false)
    const [bookingUser, setBookingUser] = useState<UserType>({} as UserType)
    const [loadingUser,setLoadingUser] = useState(false)

    const { user, booking, selectedDate, timeSlot, updateBookings, snackTrigger } = props
    const bookedTimeSlot = booking != null;
    let snackString;
    const myTimeSlot = user.name == booking?.userName ? bookedTimeSlot : null;
    
    // Function for booking time
    const handleBook = async () => {
        setDisabled(true)
        const date = new Date(timeFromTimeSlot(selectedDate, timeSlot))
        const jsonBooking = { userName: (user.name as string), date: date, timeSlot: timeSlot, createdAt: new Date()}
        const response = await fetch("/api/bookings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(jsonBooking)
        });
        updateBookings();
        if (response.ok) {
            snackString = "Du har bokat: " + String(timeSlot)
            snackTrigger("success", snackString)
        } else if (response.status == 400) {
            snackString = "Du kan inte boka flera tider"
            snackTrigger("error", snackString)
        } else if (response.status == 406) {
            snackString = "Du kan inte boka tider som redan varit"
            snackTrigger("error", snackString)
        }
        setDisabled(false)

    }
    // Function for deleting already aquired time
    const handleCancel = async () => {
        const api_url = "/api/bookings" + "/" + (booking?._id);
        const response = await fetch(api_url, {
            method: "DELETE",
        });
        updateBookings();
        if (response.ok) {
            snackString = "Du har avbokat tiden"
            snackTrigger("success", snackString)
        } else {
            snackString = "Internt fel"
            snackTrigger("error", snackString)
        }
    }
    // Function for showing info on booked time
    const showBookedTime = async ()=>{
        
        if(!showBookingInfo){
            setLoadingUser(true)
            setShowBookingInfo(!showBookingInfo);
            const response = await fetch("/api/user/"+booking?.userName)
            if(response.ok){
                try{
                const responseContent = await response.json()
                setBookingUser({...responseContent})
            }catch(error){ 
                console.log(error)
            }
        }
        setLoadingUser(false)
        return
    }
    setShowBookingInfo(!showBookingInfo);
    }

    return (
            <Grid container spacing={1} direction="row" justifyContent ="center" alignItems="center"> 
                <Grid item xs={3} >
                    <Box>
                        <Typography align="center">{timeSlots.indexOf(timeSlot)+1}</Typography>
                    </Box>
                    
                </Grid>
                <Grid item xs={6} >
                    <Button 
                        sx={{whiteSpace: "nowrap", minWidth: "auto"}}
                        size="small"
                        fullWidth={true}
                        onClick={bookedTimeSlot && myTimeSlot ? handleCancel : handleBook} 
                        color={!bookedTimeSlot ? 'primary' : 'secondary'} 
                        disabled={(bookedTimeSlot && !myTimeSlot) || disabled} variant="contained"  > 
                        {props.timeSlot} 
                    </Button>
                </Grid>
                    <Grid container xs={3}  justifyContent ="center">
                                <IconButton disabled={!(bookedTimeSlot && !myTimeSlot)} onClick={()=>{showBookedTime()}} style={{padding:0, height:20, width:20, marginBottom:"-8px"}}>
                                {(bookedTimeSlot && !myTimeSlot)?
                                        <InfoOutlinedIcon color="action" fontSize = "small" />
                                        : null}
                                </IconButton>
                                {booking&&<BookingInfo
                                    showBookingInfo={showBookingInfo}
                                    showBookedTime={showBookedTime}
                                    booking = {booking}
                                    user = {bookingUser}  
                                    loading = {loadingUser}
                                />}
                    </Grid>
            </Grid>

    );
};

export default BookingButton;