import { LocalizationProvider, PickersDay, StaticDatePicker } from "@mui/lab";
import React, { useEffect, useState } from "react";
import AdapterDateFns  from '@mui/lab/AdapterDateFns'
import { Badge, Container, Grid, Stack, TextField, Typography } from "@mui/material";
import svLocale from 'date-fns/locale/sv';
import BookingButtonGroup from "./BookingButtonGroup";
import {fetchTimes} from "../../utils/fetchTimes"

interface Props {
    title: String;
}

const BookingCalendar = (props: Props) => {
    let initialized = true
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [showButtons, setShowButtons] = useState<boolean>(false);
    const [bookedTimes, setBookedTimes] = useState<Array<boolean>>(new Array(10).fill(false));
    const times: Array<string> = [  "07:00-08:30",
                                    "08:30-10:00",
                                    "10:00-11:30",
                                    "11:30-13:00",
                                    "13:00-14:30",
                                    "14:30-16:00",
                                    "16:00-17:30",
                                    "17:30-19:00",
                                    "19:00-20:30",
                                    "20:30-22:00"]

    let bookingButtonGroup = (
        <Grid container direction="row" justifyContent="center" alignItems="left">
            <BookingButtonGroup selectedDate={selectedDate} times={times} booked={bookedTimes}/>
        </Grid>
    )
    let loadingText = (
        <Typography variant="body1" align = "center">Laddar...</Typography>
    )  

    return (
    <div>
        <Typography sx={{m:3}} variant="h2" component="h2" align = "center"> {props.title} </Typography>
        <Grid container spacing={1} direction="row" justifyContent="center" alignItems="left">
        <Grid item xs="auto" >
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={svLocale}>
            <StaticDatePicker<Date>
                orientation="landscape"
                displayStaticWrapperAs="desktop"
                openTo="day"
                showDaysOutsideCurrentMonth={true}
                views={['day']}
                showToolbar = {true}
                value={selectedDate}
                toolbarTitle = {"Valt Datum: "}
                allowSameDateSelection = {true}
                onChange={async (date) => {
                    setShowButtons(false) 
                    date && setBookedTimes(await fetchTimes(date))
                    date && setSelectedDate(date)
                    setShowButtons(true)                 
                }           
                }
                renderInput={(params) => <TextField {...params} />}
            />
        </LocalizationProvider>
        
        
        </Grid>
        <Grid item xs={2} >
            
        {showButtons ? bookingButtonGroup : loadingText}
        </Grid>
        </Grid>
    </div>
    );
}
export default BookingCalendar;