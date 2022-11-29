import { StaticDatePicker, LocalizationProvider, PickersDay } from '@mui/x-date-pickers';
import React, { useState, useEffect, forwardRef} from "react";
import AdapterDateFns from '@date-io/date-fns'
import { Badge, Grid, TextField, AlertColor, Typography } from "@mui/material";
import svLocale from 'date-fns/locale/sv';
import BookingButtonGroup from "./BookingButtonGroup";
import {Booking, timeSlots} from "../../utils/types";
import { UserProfile } from "@auth0/nextjs-auth0";
import { getDateBookings, compareDates } from "../../utils/bookingsAPI"
import {Snack, SnackInterface} from "../components/Snack"
import Pusher from 'pusher-js'

interface Props {
    title: string;
    user: UserProfile;
    initBookings: Array<Booking>;
}

const BookingCalendar = (props: Props) => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [bookings, setBookings] = useState<Array<Booking>>(props.initBookings);
    const [snack, setSnack] = useState<SnackInterface>({show: false, snackString : "", severity: "success"})
    const { user } = props;

    // Substitute for componntDidMount()
    useEffect(() => {
        const pusher = new Pusher("fa569778e9e1c854bf93",{
            cluster: "eu",
            forceTLS: true
        })
        const channel = pusher.subscribe("RTupdate")
        channel.bind('notify', () => {
            updateBookings()
          });
       }, [])

    const updateBookings = async () => {
        //fetch bookings and update
        const res = await fetch("/api/bookings")
        const resBooking: Array<Booking> = await res.json()
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

    const snackTrigger = (severity : AlertColor, snackString : string) => {
        setSnack({show: true, snackString : snackString, severity : severity})
    }

    const resetSnack = () => {
        setSnack({show: false, snackString : snack.snackString, severity : snack.severity})
    }

    const bookingButtonGroup = (    
        <Grid container direction="row" justifyContent="center" alignItems="left">
            <BookingButtonGroup timeSlots={timeSlots} bookedBookings={ getDateBookings(bookings, selectedDate) } selectedDate = {selectedDate} user = { user } updateBookings = {updateBookings} snackTrigger = {snackTrigger}/>
        </Grid>
    )
    
    return (
    <div>
        <Typography sx={{m:3}} variant="h3" component="h2" align = "center"> {props.title} </Typography>
        <Grid container spacing={1} direction="row" justifyContent="center" alignItems="left">
        <Grid item xs="auto" >
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={svLocale}>
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
       <Snack state = {snack} handleClose = {resetSnack}/>
    </div>
    );
}
export default BookingCalendar;