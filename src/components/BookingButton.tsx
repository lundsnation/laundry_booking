import { Button, Container, AlertColor, Grid, IconButton, Typography,Box } from "@mui/material"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { UserProfile } from "@auth0/nextjs-auth0";
import React, { useState } from "react";
import { Booking, timeFromTimeSlot } from "../../utils/types"
import BookingInfo from "./BookingInfo"
import { timeSlots } from "../../utils/types";

interface Props {
    user: UserProfile;
    booking: Booking | null;
    selectedDate: Date;
    timeSlot: string;
    updateBookings: () => void;
    snackTrigger: (severity: AlertColor, snackString: string) => void;
}
const BookingButton = (props: Props) => {
    // Checking if the supplied timeslot is the users booking
    const [disabled, setDisabled] = useState<boolean>(false)
    const [showBookingInfo,setShowBookingInfo] = useState<boolean>(false);

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
    const showBookedTime = (state:boolean)=>{
        setShowBookingInfo(state);
    }

    return (
         <Container sx = {{maxHeight: 34,width:250, paddingLeft: 0,paddingRight:0}}>
            <Grid container direction="row"  alignItems="center"> 
                <Grid item xs={2} md={2}>
                    <Box style={{paddingRight: 10}}>
                        <Typography align="center" style={{fontWeight: "bold"}}>{timeSlots.indexOf(timeSlot)+1}</Typography>
                    </Box>
                    
                </Grid>
                <Grid item xs={8} md ={8} >
                    <Button 
                        style={{ height: "34px", width:"130px",paddingRight:10,paddingLeft:10}} 
                        onClick={bookedTimeSlot && myTimeSlot ? handleCancel : handleBook} 
                        color={!bookedTimeSlot ? 'primary' : 'secondary'} 
                        // fullWidth = {true}
                        disabled={(bookedTimeSlot && !myTimeSlot) || disabled} variant="contained"  > 
                        {props.timeSlot} 
                    </Button>
                </Grid>
                    <Grid item xs={2} md={2} >
                    <Container style={{width:80,paddingLeft:0,paddingRight:0}}>
                        {(bookedTimeSlot && !myTimeSlot)?
                            <React.Fragment>
                                   <IconButton onClick={()=>{showBookedTime(true)}}>
                                <InfoOutlinedIcon color="action" fontSize = "small"/>
                            </IconButton>
                            <BookingInfo
                            showBookingInfo={showBookingInfo}
                            showBookedTime={showBookedTime}
                            booking = {booking}   
                            />
                            </React.Fragment>
                            : null
                        }
                        </Container>
                    </Grid>
            </Grid>
         </Container >
    );
};

export default BookingButton;