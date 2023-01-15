import { StaticDatePicker, LocalizationProvider, PickersDay } from '@mui/x-date-pickers';
import React, { useState, useEffect } from "react";
import AdapterDateFns from '@date-io/date-fns'
import { Grid, Box, SxProps, TextField, AlertColor, Paper, Typography, SnackbarOrigin } from "@mui/material";
import svLocale from 'date-fns/locale/sv';
import BookingButtonGroup from "./BookingButtonGroup";
import BookedTimes from '../BookedTimes';
import { Booking, UserType } from "../../../utils/types";
import { getDateBookings, compareDates } from "../../../utils/bookingsAPI"
import { Snack, SnackInterface } from "../Snack"
import { pusherClient } from '../../../utils/pusherAPI'

interface Props {
    title: string;
    user: UserType;
}


const BookingCalendar = (props: Props) => {

    const [firstRender, setFirstRender] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [bookings, setBookings] = useState<Array<Booking>>([]);
    const [snack, setSnack] = useState<SnackInterface>({ show: false, snackString: "", severity: "success", alignment: { vertical: "bottom", horizontal: "left" } })
    const [realtimeSnack, setRealtimeSnack] = useState<SnackInterface>({ show: false, snackString: "", severity: "success", alignment: { vertical: "bottom", horizontal: "right" } })
    const todaysDateMinus2Days = new Date(new Date().setDate(new Date().getDate() - 2));
    const { user } = props;

    const updateBookings = async () => {
        //fetch bookings and update
        const res = await fetch("/api/bookings")
        const resBooking: Array<Booking> = await res.json();
        const bookings: Array<Booking> = [];
        resBooking.forEach(booking => {
            const tmpBooking = { ...booking, date: new Date(booking.date) }
            bookings.push(tmpBooking);
        });
        setBookings(bookings);
    }

    useEffect(()=>{
        const pusher = pusherClient();
        const pusherChannel = pusher.subscribe("bookingUpdates");
        pusherChannel.bind('bookingUpdate', (data: any) => {
            updateBookings();
            const { userName, date, timeSlot } = data
            const isPostRequest = data.request == 'post'
            const tmpDate = new Date(date);
            const dateString = tmpDate.getFullYear() + "/" + (tmpDate.getMonth() + 1) + "/" + tmpDate.getDay()
            const snackString = isPostRequest ? userName + ' bokade ' + dateString + ', ' + timeSlot : userName + ' avbokade ' + dateString + ', ' + timeSlot
            const severity = "info"
            //const alignment: SnackbarOrigin = {vertical: 'bottom', horizontal: 'right'}
            const myBooking = userName == user.name
            console.log("this should print every event")

            console.log("window.innerWidt: " + window.innerWidth)

            const alignment: SnackbarOrigin = window.innerWidth > 600 ? { vertical: 'bottom', horizontal: 'right' } : { vertical: 'top', horizontal: 'right' }

            !myBooking && setRealtimeSnack({ show: true, snackString: snackString, severity: severity, alignment: alignment })
        })
    },[])

        
    


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

    //Should be optimized,abstracted and refined later
    const handleDayColor = (day: Date): SxProps => {
        const oldDate = todaysDateMinus2Days.getTime() > day.getTime();

        let nbrBookedTimes: number = 0;

        /*If it's not an old date we calculate the number of booknings for that day,
        else we let nbrBookedTimes = 0, which means it wont get any color */
        !oldDate && bookings.forEach(booking => {
            if (compareDates(booking.date, day)) {
                nbrBookedTimes += 1;
            }

        });

        interface colorProps {
            backgroundColor: string,
            hoverBackgroundcolor: string,
            color: string
        }

        const color = (nbr: number): colorProps | undefined => {
            if (nbr == 10) {
                return {
                    color: "#FFFFFF",
                    backgroundColor: "#b72c3b",
                    hoverBackgroundcolor: "#801e29"
                }
            } else if (nbr >= 4 && nbr < 10) {

                return {
                    color: "#FFFFFF",
                    backgroundColor: "#f3c86e",
                    hoverBackgroundcolor: "#eac16d"
                }
            }

            return undefined
        }

        return {
            "&.MuiPickersDay-root": {
                color: color(nbrBookedTimes)?.color,
                backgroundColor: color(nbrBookedTimes)?.backgroundColor,
                '&:hover': {
                    backgroundColor: color(nbrBookedTimes)?.hoverBackgroundcolor,
                }
            },

            "&.Mui-selected": {
                backgroundColor: "#6e8f68",
                '&:hover': {
                    backgroundColor: "#4d6448"
                }
            }
        }
    }

    //get initial bookings
    useEffect(() => {
        updateBookings()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const snackTrigger = (severity: AlertColor, snackString: string, alignment: SnackbarOrigin) => {
        setSnack({ show: true, snackString: snackString, severity: severity, alignment: alignment })

    }

    const resetSnack = () => {
        setSnack({ show: false, snackString: snack.snackString, severity: snack.severity, alignment: snack.alignment })
    }

    const resetRealtimeSnack = () => {
        setRealtimeSnack({ show: false, snackString: realtimeSnack.snackString, severity: realtimeSnack.severity, alignment: realtimeSnack.alignment })
    }

    const bookingButtonGroup = (
        <BookingButtonGroup timeSlots={timeSlots} bookedBookings={getDateBookings(bookings, selectedDate)} selectedDate={selectedDate} user={user} updateBookings={updateBookings} snackTrigger={snackTrigger} />
    )

    return (
        <div>
            <Snack state={realtimeSnack} handleClose={resetRealtimeSnack} />
            <Snack state={snack} handleClose={resetSnack} />
            <Grid
                container
                maxWidth={600}
                spacing={2}
                >
                <Grid item xs={12} md={12}>
                    <Grid container>
                        <Grid item xs={12} md={7}>
                            <Paper elevation={0} variant={"outlined"}>
                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={svLocale}>
                                    <StaticDatePicker<Date>
                                        minDate={todaysDateMinus2Days}
                                        orientation="landscape"
                                        displayStaticWrapperAs="desktop"
                                        openTo="day"
                                        showDaysOutsideCurrentMonth={true}
                                        views={['day']}
                                        showToolbar={false}
                                        value={selectedDate}
                                        toolbarTitle={"Valt Datum: "}
                                        onChange={async (date) => {
                                            date && setSelectedDate(date);
                                            //updateBookings();
                                        }
                                        }
                                        renderInput={(params) => <TextField {...params} />}
                                        renderDay={(day, _value, DayComponentProps) => {
                                            return (
                                                <PickersDay sx={handleDayColor(day)} {...DayComponentProps} />
                                            );

                                        }}
                                    />
                                </LocalizationProvider>
                            </Paper>
                        </Grid>
                            <Grid item xs={12} md={5}>
                                    <Grid container>
                                        <Grid item xs={12}>
                                                {bookingButtonGroup}
                                        </Grid>
                                    </Grid>
                            </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <BookedTimes bookings={bookings} user={user} snackTrigger={snackTrigger} />
                </Grid>

            </Grid>
        </div>
    );
}
export default BookingCalendar;
