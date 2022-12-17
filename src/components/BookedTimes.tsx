import React, { useState, useEffect, forwardRef } from "react";
import { Card,Box, Grid, Divider, Chip, AlertColor, Typography, Button, List, ListItem} from "@mui/material";
import { Booking, timeSlots } from "../../utils/types";
import { UserProfile } from "@auth0/nextjs-auth0";
import { getDateBookings, compareDates } from "../../utils/bookingsAPI"
import { Snack, SnackInterface } from "../components/Snack"
import { minHeight, Stack } from "@mui/system";


interface Props {
    bookings: Array<Booking>,
    user: UserProfile,
    updateBookings: () => void,
    snackTrigger: (severity: AlertColor, snackString: string) => void
}






const BookedTimes = (props: Props) => {
    const {bookings, user,} = props;
    let snackString = ""

    const getUserTimes = ()=> {
        let res;
        if(bookings){
            res = [];
            for(let i  = 0;i<bookings.length;i++){
                if(bookings[i].userName == user.name){
                    res.push(bookings[i])
                }
            }
            return res;
        }
        return null;
    }

    const handleCancel = async (bookedTime: Booking ) => {
        const api_url = "/api/bookings" + "/" + (bookedTime._id);
        const response = await fetch(api_url, {
            method: "DELETE",
        });
        props.updateBookings();
        if (response.ok) {
            snackString = "Du har avbokat tiden"
            props.snackTrigger("success", snackString)
        } else {
            snackString = "Internt fel"
            props.snackTrigger("error", snackString)
        }
    }

    const stringify = (bookedTime : Booking) =>{
        return bookedTime.date.toLocaleDateString('sv-SE') + " " +bookedTime.timeSlot
    }

    return (
        <Card elevation={3} variant = {"outlined"} sx = {{minWidth: 300, minHeight: 220, maxHeight: 220}}>
      <Box sx={{ my: 1, mx: 2 }}>
        <Grid container alignItems="center">
          <Grid item xs>
            <Typography variant ="h6" sx={{fontWeight: 'bold'}}>
            { user.name}
            </Typography>
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
                return <Chip 
                color = "error" 
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