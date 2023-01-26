import { StaticDatePicker, LocalizationProvider, PickersDay, PickersDayProps } from '@mui/x-date-pickers';
import React, { useState, useEffect } from "react";
import AdapterDateFns from '@date-io/date-fns'
import { Grid, Box, SxProps, TextField, AlertColor, Paper, Typography, SnackbarOrigin, Badge } from "@mui/material";
import svLocale from 'date-fns/locale/sv';
import BookingButtonGroup from "./BookingButtonGroup";
import BookedTimes from '../BookedTimes';
import { Booking, JsonBooking, UserType } from "../../../utils/types";
import { getDateBookings, compareDates } from "../../../utils/bookingsAPI"
import { Snack, SnackInterface } from "../Snack"
import { pusherClient } from '../../../utils/pusherAPI'

interface Props {
    title: string;
    user: UserType;
}

const BookingCalendar = (props: Props) => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [bookings, setBookings] = useState<Array<Booking>>([]);
    const [snack, setSnack] = useState<SnackInterface>({ show: false, snackString: "", severity: "success", alignment: { vertical: "bottom", horizontal: "left" } })
    const [realtimeSnack, setRealtimeSnack] = useState<SnackInterface>({ show: false, snackString: "", severity: "success", alignment: { vertical: "bottom", horizontal: "right" } })
    const todaysDateMinus2Days = new Date(new Date().setDate(new Date().getDate() - 2));
    const { user } = props;
    const userBookings = bookings.filter(booking => booking.userName === user.name)

    const updateBookings = async () => {
        //fetch bookings and update
        const jsonBookings: Array<JsonBooking> = await (await fetch("/api/bookings")).json()
        const bookings = jsonBookings.map(booking => (
            { ...booking, date: new Date(booking.date) }
        ));

        setBookings(bookings);
    }

    useEffect(() => {
        updateBookings();

        const pusher = pusherClient();
        const pusherChannel = pusher.subscribe("bookingUpdates");
        pusherChannel.bind('bookingUpdate', (data: any) => {
            updateBookings();
            const { userName, date, timeSlot } = data
            const isPostRequest = data.request == 'post'
            const tmpDate = new Date(date);
            const dateString = tmpDate.getFullYear() + "/" + (tmpDate.getMonth() + 1) + "/" + tmpDate.getDay() + ", " + timeSlot
            const snackString = `${userName} ${isPostRequest ? ' bokade ' : ' avbokade '} ${dateString}`
            const myBooking = userName == user.name
            const alignment: SnackbarOrigin = window.innerWidth > 600 ? { vertical: 'bottom', horizontal: 'right' } : { vertical: 'top', horizontal: 'right' }

            !myBooking && setRealtimeSnack({ show: true, snackString: snackString, severity: "info", alignment: alignment })
        })

        //Cleanup function
        return () => {
            pusher.unbind("bookingUpdate");
            pusher.unsubscribe("bookingUpdates");
            pusher.disconnect();
        }
    }, [])

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


    const handleRenderDay = (day: Date, _value: Date[], DayComponentProps: PickersDayProps<Date>): JSX.Element => {
        const oldDate = todaysDateMinus2Days.getTime() > day.getTime();
        let hasBookingOnDay = false;
        let nbrBookedTimes: number = 0;

        /*If it's not an old date we calculate the number of booknings for that day,
        else we let nbrBookedTimes = 0, which means it wont get any color */
        !oldDate && bookings.forEach(booking => {


            if (compareDates(booking.date, day)) {
                nbrBookedTimes += 1;

                if (booking.userName == user.name) {
                    hasBookingOnDay = true;
                }
            }

        });

        if (nbrBookedTimes == timeSlots.length && hasBookingOnDay) {
            return (
                <Badge
                    key={day.toString()}
                    color={"secondary"}
                    badgeContent={""}
                    overlap="circular"
                    variant="dot"
                >
                    <PickersDay
                        sx={{
                            "&.MuiPickersDay-root": {
                                color: "#FFFFFF",
                                backgroundColor: "#e65b62",
                                '&:hover': {
                                    backgroundColor: "#e3454d"
                                }

                            }
                        }}
                        {...DayComponentProps} />
                </Badge>
            )
        } else if (nbrBookedTimes != timeSlots.length && hasBookingOnDay) {
            return (
                <Badge
                    key={day.toString()}
                    color={"secondary"}
                    badgeContent={""}
                    overlap="circular"
                    variant="dot"
                >
                    <PickersDay {...DayComponentProps} />
                </Badge>
            )
        } else if (nbrBookedTimes == timeSlots.length && !hasBookingOnDay) {
            return (
                <PickersDay
                    sx={{
                        "&.MuiPickersDay-root": {
                            color: "#FFFFFF",
                            backgroundColor: "#e65b62",
                            '&:hover': {
                                backgroundColor: "#e13740"
                            }

                        }
                    }}
                    {...DayComponentProps} />
            )
        } else {
            return <PickersDay {...DayComponentProps} />
        }
    }

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
        <Grid
            container
            maxWidth={600}
        >
            <Snack state={realtimeSnack} handleClose={resetRealtimeSnack} />
            <Snack state={snack} handleClose={resetSnack} />
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
                                renderDay={handleRenderDay}
                            />
                        </LocalizationProvider>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={5} sx={{ pt: { xs: 2, sm: 0 } }}>
                    {bookingButtonGroup}
                </Grid>
                <Grid item xs={12} pt={2}>
                    <BookedTimes userBookings={userBookings} user={user} snackTrigger={snackTrigger} />
                </Grid>
            </Grid>


        </Grid>
    );
}
export default BookingCalendar;
