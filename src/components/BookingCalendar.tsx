import { LocalizationProvider, PickersDay, StaticDatePicker } from "@mui/lab";
import React, { useEffect, useState } from "react";
import AdapterDateFns  from '@mui/lab/AdapterDateFns'
import { Badge, Container, Grid, Stack, TextField, Typography } from "@mui/material";
import svLocale from 'date-fns/locale/sv';
import { getDayOfYear } from 'date-fns';
import BookingButton from "./BookingButton";
import BookingButtonGroup from "./BookingButtonGroup";

interface Props {
    title: String;
}

/* relevant props
disablePast={true}
🔴
*/



const BookingCalendar = (props: Props) => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [bookedDates, setBookedDates] = useState<Array<number>>([]);
    const [showButtons, setShowButtons] = useState<boolean>(false);

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
        <Grid container direction="row" justifyContent="center" alignItems="center">
            <BookingButtonGroup selectedDate={selectedDate} times={times} />
        </Grid>
    );
    //var isBooked: boolean = false;
    


    const handleAddBokedDate = (date: Date) => {
        setBookedDates((prevBookedDates) => [
            ...prevBookedDates, getDayOfYear(date)
        ])
    }

    const handleRemoveBookedDate = (removeDate: Date) => {
      setBookedDates(bookedDates.filter(date => date !== getDayOfYear(removeDate)))
    };

    
    return (
    <div>
        <Grid container direction="row" justifyContent="center" alignItems="center">
            <Typography variant="h2" component="h2"> {props.title} </Typography>;
        </Grid>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={svLocale}>
            <StaticDatePicker<Date>
                orientation="landscape"
                displayStaticWrapperAs="desktop"
                openTo="day"
                showDaysOutsideCurrentMonth={true}
                views={['day']}
                value={selectedDate}
                allowSameDateSelection = {true}
                onChange={(date) => {
                    //Sets selectedDate if date is not null

                    date && setSelectedDate(date);
                    

                    if(date) {
                        if(!bookedDates.includes(getDayOfYear(date))) {
                            handleAddBokedDate(date)
                        } else {
                            console.log("Got here");
                            handleRemoveBookedDate(date)
                        }
                    }
                    //Adds date to bookedDates if date is not null and is not included in bookedDates
                    //date && !bookedDates.includes(getDayOfYear(date)) && handleAddBokedDate(date);

                    //Removes date from bookedDates if date is not null and is included in bookedDates
                    //date && bookedDates.includes(getDayOfYear(date)) && handleRemoveBookedDate(date)
                    date && setShowButtons(!showButtons || getDayOfYear(date) != getDayOfYear(selectedDate))

                    bookingButtonGroup = <h1>asd</h1>;
                    
                }}

                renderInput={(params) => <TextField {...params} />}
                renderDay={(day, _value, DayComponentProps) => {
                    var isBooked = false;

                    const calendarDayInYear = getDayOfYear(day);
                    bookedDates.forEach(bookedDayInYear => {
                        if(calendarDayInYear === bookedDayInYear)
                            isBooked = true
                    });
                

                    return (
                        <Badge
                            key={day.toString()}
                            overlap="circular"
                            badgeContent={isBooked ? '🔴' : undefined}
                        >
                            <PickersDay {...DayComponentProps} />
                        </Badge>
                    );
                    
                }}
            />
        </LocalizationProvider>

        {showButtons ? bookingButtonGroup : null}
        
    </div>
    );
}

export default BookingCalendar;