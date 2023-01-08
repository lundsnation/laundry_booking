import React from "react";
import { Card,Box, Grid, Divider, Chip, AlertColor, Typography, Button, List, ListItem, SnackbarOrigin, ButtonGroup, Fade} from "@mui/material";
import { Booking, timeFromTimeSlot, timeSlots, UserType } from "../../utils/types";
import { LoadingButton } from "@mui/lab";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface Props {
    bookings: Array<Booking>,
    user: UserType,
    snackTrigger: (severity: AlertColor, snackString: string, alignment: SnackbarOrigin) => void
}

const BookedTimes = (props: Props) => {
    const {bookings, user} = props;
    let snackString;
    const alignment: SnackbarOrigin = {vertical: 'bottom', horizontal: 'left'}

    const getUserTimes = ()  => {
        let res,tempLoading;
        res = [];
        if(bookings){
            const now = new Date()
            for(let i  = 0;i<bookings.length;i++){
                if(bookings[i].userName == user.name && bookings[i].date>now){
                    res.push(bookings[i])
                }
            }   
        }
    return res;
    }

    const handleCancel = async (bookedTime: Booking,index:number ) => {
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

        if (response.ok) {
            snackString = "Du har avbokat tiden"
            props.snackTrigger("success", snackString, alignment)
        } else {
            let responseContent = await response.json()
            snackString = responseContent.error
            props.snackTrigger("error", snackString, alignment)
        }
    }

    const stringify = (bookedTime : Booking) =>{
        return format(bookedTime.date,"eeee Do MMM",{locale : sv}) + " " +bookedTime.timeSlot + ", Torkbås: "+ (timeSlots.indexOf(bookedTime.timeSlot)+1)
    }

    return (
        <Card variant = {"outlined"} sx={{mb:20}}>
      <Box >
        <Grid container alignItems="center">
          <Grid item xs={12}>
            <Typography variant="body1" sx={{fontWeight:"bold"}} component="div" margin={2}>
              Dina Bokade Tider: 
            </Typography>
            <Divider variant="middle" />
          </Grid>
          <Grid container direction="column"  height={150} sx={{overflow:'auto'}}>
            <List>
                {getUserTimes() && getUserTimes()?.length>0?
                getUserTimes()?.map((time,i)=>{
                    return(<ListItem key={time.date + time.timeSlot}>
                            <Fade in={time!=undefined}>
                                <ButtonGroup variant="outlined" fullWidth>
                                    <Button disabled fullWidth sx={{textTransform: 'none'}}>
                                        <Typography variant="body2" sx={{color:"black"}}>
                                            {stringify(time)}
                                        </Typography>
                                    </Button>
                                    <LoadingButton  
                                        onClick={()=>{handleCancel(time,i)}} 
                                        variant= "outlined" 
                                        color="error"
                                        sx={{width:"50%"}} >
                                        <Typography variant="body2">
                                            Avboka    
                                        </Typography>
                                    </LoadingButton>
                                </ButtonGroup>
                            </Fade>
                        </ListItem>)
                }):
                <ListItem>
                    <Typography variant="subtitle2" >
                        Du har inga bokade tider
                    </Typography>
                </ListItem>
                }
            </List>
          </Grid>
        </Grid> 
      </Box>
    </Card>
)}
export default BookedTimes;