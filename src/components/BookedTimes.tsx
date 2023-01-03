import React, { useState, useEffect, forwardRef } from "react";
import { Card,Box, Grid, Divider, Chip, AlertColor, Typography, Button, List, ListItem, SnackbarOrigin} from "@mui/material";
import { Booking, timeFromTimeSlot, timeSlots } from "../../utils/types";
import { UserProfile } from "@auth0/nextjs-auth0";
import DeleteIcon from '@mui/icons-material/DeleteOutlined';

import  {Stack}  from "@mui/system";


interface Props {
    bookings: Array<Booking>,
    user: UserProfile,
    selectedDate: Date;
    updateBookings: () => void,
    snackTrigger: (severity: AlertColor, snackString: string, alignment: SnackbarOrigin) => void
}






const BookedTimes = (props: Props) => {
    const {bookings, user} = props;
    let snackString = ""
    const alignment: SnackbarOrigin = {vertical: 'bottom', horizontal: 'left'}

    const getUserTimes = ()=> {
        let res;
        if(bookings){
            res = [];
            const now = new Date()
            for(let i  = 0;i<bookings.length;i++){
                if(bookings[i].userName == user.name && bookings[i].date>now){
                    res.push(bookings[i])
                }
            }
            return res;
        }
        return null;
    }

    
    const handleCancel = async (bookedTime: Booking ) => {
        const api_url = "/api/bookings" + "/" + (bookedTime?._id);
        const date = new Date(timeFromTimeSlot(bookedTime.date, bookedTime.timeSlot))
        const jsonBooking = { userName: (user.name as string), date: date, timeSlot: bookedTime.timeSlot, createdAt: new Date()}
        const response = await fetch(api_url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(jsonBooking)
        });

        props.updateBookings();
        if (response.ok) {
            snackString = "Du har avbokat tiden"
            props.snackTrigger("success", snackString, alignment)
        } else {
            snackString = "Internt fel"
            props.snackTrigger("error", snackString, alignment)
        }
    }

    const stringify = (bookedTime : Booking) =>{
        return bookedTime.date.toLocaleDateString('sv-SE') + " " +bookedTime.timeSlot + ", Torkbås: "+ (timeSlots.indexOf(bookedTime.timeSlot)+1)
    }

    return (
        <Card variant = {"outlined"} sx = {{minWidth: 300, minHeight: 220, maxHeight: 220}}>
      <Box sx={{ my: 1, mx: 2 }}>
        <Grid container alignItems="center">
          <Grid item xs>
            <Typography  variant="h6" component="div">
              Bokade Tider: 
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ m: 1 }}>
        <Stack direction = "column" 
        spacing = {1} 
        divider={<Divider variant="middle"/>}
        >

    
        {getUserTimes()?.map(bookedTime =>{
                return <Chip  key={stringify(bookedTime)}
                color = "error" 
                deleteIcon = {<DeleteIcon/>}
                label = {stringify(bookedTime)} 
                variant= "outlined" 
                onDelete={() => {    
                    handleCancel(bookedTime)
                }}/>
                })}
 
       
        </Stack>
      </Box>
    </Card>
    );
}
export default BookedTimes;