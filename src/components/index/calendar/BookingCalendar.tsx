import {StaticDatePicker, LocalizationProvider, PickersDay, PickersDayProps} from '@mui/x-date-pickers';
import React, {useState, useEffect} from "react";
import AdapterDateFns from '@date-io/date-fns'
import {Grid, TextField, AlertColor, Paper, Typography, SnackbarOrigin, Badge} from "@mui/material";
import svLocale from 'date-fns/locale/sv';
import BookingButtonGroup from "./BookingButtonGroup";
import BookedTimes from '../bookedTimes/BookedTimes';
import {UserType} from "../../../../utils/types";
import {Snack, SnackInterface} from "../../Snack"
import {FrontendPusher, BookingUpdate} from '../../../../utils/pusherApi'
import Bookings from '../../../classes/Bookings';
import TimeSlots from '../../../classes/TimeSlots';
import {getBuilding} from "../../../../utils/helperFunctions";

interface Props {
    title: string;
    user: UserType;
    initalBookings: Bookings
}

const BookingCalendar = (props: Props) => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [bookings, setBookings] = useState<Bookings>(props.initalBookings);
    const [snack, setSnack] = useState<SnackInterface>({
        show: false,
        snackString: "",
        severity: "success",
        alignment: {vertical: "bottom", horizontal: "left"}
    })
    const [realtimeSnack, setRealtimeSnack] = useState<SnackInterface>({
        show: false,
        snackString: "",
        severity: "success",
        alignment: {vertical: "bottom", horizontal: "right"}
    })
    const timeSlots = TimeSlots.getTimeSlots(selectedDate);
    const {user} = props;

    const activeUserBookings = bookings.getActiveUserBookings(user.name)

    const updateBookings = async () => {
        try {
            const bookings = await Bookings.fetch();
            setBookings(bookings);
        } catch (error) {
            console.error("Error updating bookings:", error);
        }
    };


    useEffect(() => {
        //updateBookings();

        const frontendPusher = new FrontendPusher();
        // const pusherChannel = pusher.subscribe(getBuilding(user.name) + "bookingUpdates");
        const channel = frontendPusher.bookingUpdatesSubscribe(getBuilding(user.name));

        channel.bind(frontendPusher.bookingUpdateEvent, (bookingUpdate: BookingUpdate) => {
            updateBookings();
            const {userName, date, timeSlot, method} = bookingUpdate
            const isPostRequest = method === frontendPusher.bookingUpdateMethod.POST
            const tmpDate = new Date(date);
            const dateString = tmpDate.getFullYear() + "/" + (tmpDate.getMonth() + 1) + "/" + tmpDate.getDay() + ", " + timeSlot
            const snackString = `${userName} ${isPostRequest ? ' bokade ' : ' avbokade '} ${dateString}`
            const myBooking = userName == user.name
            const alignment: SnackbarOrigin = window.innerWidth > 600 ? {
                vertical: 'bottom',
                horizontal: 'right'
            } : {vertical: 'top', horizontal: 'right'}

            !myBooking && setRealtimeSnack({
                show: true,
                snackString: snackString,
                severity: "info",
                alignment: alignment
            })
        })

        //Cleanup function
        return () => {
            frontendPusher.cleanup();
        }
    }, [])

    const todaysDateMinus2Days = new Date(new Date().setDate(new Date().getDate() - 2));
    const handleRenderDay = (day: Date, _value: Date[], DayComponentProps: PickersDayProps<Date>): JSX.Element => {
        const oldDate = todaysDateMinus2Days.getTime() > day.getTime();
        let hasBookingOnDay = false;
        let nbrBookedTimes: number = 0;

        /*If it's not an old date we calculate the number of booknings for that day,
        else we let nbrBookedTimes = 0, which means it wont get any color */
        !oldDate && bookings.forEach(booking => {


            if (booking.isSameDate(day)) {
                nbrBookedTimes += 1;

                if (booking.isUserBooking(user.name)) {
                    hasBookingOnDay = true;
                }
            }

        });

        if (nbrBookedTimes == TimeSlots.length && hasBookingOnDay) {
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
        } else if (nbrBookedTimes != TimeSlots.getLength() && hasBookingOnDay) {
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
        } else if (nbrBookedTimes == TimeSlots.getLength() && !hasBookingOnDay) {
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
        setSnack({show: true, snackString: snackString, severity: severity, alignment: alignment})

    }

    const resetSnack = () => {
        setSnack({show: false, snackString: snack.snackString, severity: snack.severity, alignment: snack.alignment})
    }

    const resetRealtimeSnack = () => {
        setRealtimeSnack({
            show: false,
            snackString: realtimeSnack.snackString,
            severity: realtimeSnack.severity,
            alignment: realtimeSnack.alignment
        })
    }

    const bookingButtonGroup = (
        <BookingButtonGroup timeSlots={timeSlots} bookedBookings={bookings.getDateBookings(selectedDate)}
                            selectedDate={selectedDate} user={user} updateBookings={updateBookings}
                            snackTrigger={snackTrigger}/>
    )

    return (
        <Grid
            container
            maxWidth={600}
        >
            <Snack state={realtimeSnack} handleClose={resetRealtimeSnack}/>
            <Snack state={snack} handleClose={resetSnack}/>
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
                <Grid item xs={12} md={5} sx={{pt: {xs: 2, sm: 0}}}>
                    {bookingButtonGroup}
                </Grid>
                <Grid item xs={12} pt={2}>
                    <BookedTimes activeUserBookings={activeUserBookings} user={user} snackTrigger={snackTrigger}/>
                </Grid>
            </Grid>


        </Grid>
    );
}
export default BookingCalendar;
