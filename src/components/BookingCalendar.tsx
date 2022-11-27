import { StaticDatePicker, LocalizationProvider, PickersDay } from '@mui/x-date-pickers';
import React, { useState, useEffect } from "react";
import AdapterDateFns from '@date-io/date-fns'
import { Badge, Grid, TextField, Typography } from "@mui/material";
import svLocale from 'date-fns/locale/sv';
import BookingButtonGroup from "./BookingButtonGroup";
import {Booking} from "../../utils/types";
import { UserProfile } from "@auth0/nextjs-auth0";
import { getDateBookings, compareDates } from "../../utils/bookingsAPI"


interface Props {
    title: string;
    user: UserProfile;
    bookings: Array<Booking>;
}

const BookingCalendar = (props: Props) => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());


    const initBookings: Array<Booking> = [];
    //Ful lösning. Går detta att göra bättre
    props.bookings.forEach(booking => {
        const tmpBooking = {
            _id : booking._id,
            userName : booking.userName,
            date : new Date(booking.date),
            timeSlot : booking.timeSlot,
        }

        initBookings.push(tmpBooking);
    });

    const [bookings, setBookings] = useState<Array<Booking>>(initBookings);
    const { user } = props;

    const timeSlots: Array<string> = ["07:00-08:30",
                                    "08:30-10:00",
                                    "10:00-11:30",
                                    "11:30-13:00",
                                    "13:00-14:30",
                                    "14:30-16:00",
                                    "16:00-17:30",
                                    "17:30-19:00",
                                    "19:00-20:30",
                                    "20:30-22:00"]

    const updateBookings = async () => {
        //fetch bookings and update
        const res = await fetch("/api/bookings")
        
        const resBooking: Array<Booking> = await res.json();

        const bookings: Array<Booking> = [];

        resBooking.forEach(booking => {
            const tmpBooking = {
                _id : booking._id,
                userName : booking.userName,
                date : new Date(booking.date),
                timeSlot : booking.timeSlot,
            }
    
            bookings.push(tmpBooking);
        });


        setBookings(bookings);
    }

    const bookingButtonGroup = (
    
        <Grid container direction="row" justifyContent="center" alignItems="left">
            <BookingButtonGroup timeSlots={timeSlots} bookedBookings={ getDateBookings(bookings, selectedDate) } selectedDate = {selectedDate} user = { user } updateBookings = {updateBookings}/>
        </Grid>
    )
    
    return (
    <div>
        <Typography sx={{m:3}} variant="h3" component="h2" align = "center"> {props.title} </Typography>
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
                onChange={async (date) => {
                    date && setSelectedDate(date);
                    updateBookings();
                    }
                }
                renderInput={(params) => <TextField {...params} />}
                
                //DO NOT REMOVE
                renderDay={(day, _value, DayComponentProps) => {
                    let nbrBookedTimes = 0;

                    bookings.forEach(booking => {
                        if(compareDates(booking.date, day)) {
                            nbrBookedTimes += 1;
                        }
                    });
                

                    const badge = (nbr: number): string | undefined => {
                        if(nbr == 10) {
                            return '🔴';
                        }
                        else if (nbr >= 4 && nbr < 10) {
                            return '🟡'
                        }
                        return undefined;
                    }

                    return (
                        <Badge
                            key={day.toString()}
                            overlap="circular"
                            badgeContent={badge(nbrBookedTimes)}
                        >
                            <PickersDay {...DayComponentProps} />
                        </Badge>
                    );
                    
                }}
            />
        </LocalizationProvider>
        
        </Grid>
            <Grid item xs={2} >
                { bookingButtonGroup }
            </Grid>
        </Grid>
    </div>
    );
}
export default BookingCalendar;