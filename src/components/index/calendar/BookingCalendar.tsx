import {LocalizationProvider, PickersDay, PickersDayProps, StaticDatePicker} from '@mui/x-date-pickers';
import React, {useEffect, useState} from "react";
import AdapterDateFns from '@date-io/date-fns'
import {AlertColor, Badge, Button, Grid, Paper, SnackbarOrigin, TextField} from "@mui/material";
import svLocale from 'date-fns/locale/sv';
import BookingButtonGroup from "./BookingButtonGroup";
import BookedTimes from '../bookedTimes/BookedTimes';
import {Snack, SnackInterface} from "../../Snack"
import {BookingUpdate, FrontendPusher} from '../../../apiHandlers/PusherAPI'
import BookingsUtil from '../../../../utils/BookingsUtil';
import User from "../../../classes/User";
import Config, {LaundryBuilding} from "../../../configs/Config";
import Booking from "../../../classes/Booking";
import BackendAPI from "../../../apiHandlers/BackendAPI";
import DateUtils from "../../../../utils/DateUtils";

interface Props {
    config: Config
    user: User;
    initialBookings: Booking[]
}

const snackInitState: SnackInterface = {
    show: false,
    snackString: "",
    severity: "success",
    alignment: {vertical: "bottom", horizontal: "left"}
}

const snackRTState: SnackInterface = {
    show: false,
    snackString: "",
    severity: "info",
    alignment: {vertical: "bottom", horizontal: "right"}
}


const BookingCalendar = ({config, user, initialBookings}: Props) => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [bookings, setBookings] = useState<Booking[]>(initialBookings);
    const [snack, setSnack] = useState<SnackInterface>(snackInitState)
    const [realtimeSnack, setRealtimeSnack] = useState<SnackInterface>(snackRTState)
    const [laundryBuilding, setLaundryBuilding] = useState<LaundryBuilding>(user.app_metadata.laundryBuilding); // Default buildin

    console.log("user laundrybuilding : ", user.app_metadata.laundryBuilding)
    console.log("Laundrybuilding", laundryBuilding)
    const updateBookings = async () => {
        console.log("Fetching bookings for: ", laundryBuilding)
        const bookings = await BackendAPI.fetchBookingsForBuilding(laundryBuilding);
        //user.app_metadata.laundryBuilding = laundryBuilding;
        setBookings(bookings);
        user.setUserBookings(bookings)
    }

    const handleBuildingChange = (building: LaundryBuilding) => {
        setLaundryBuilding(building);
    };

    useEffect(() => {
        updateBookings();
        const frontendPusher = new FrontendPusher(laundryBuilding);
        const channel = frontendPusher.bookingUpdatesSubscribe();
        console.log("Subscribed to channel: ", channel)
        channel.bind(frontendPusher.bookingUpdateEvent, ({username, startTime, timeSlot, method}: BookingUpdate) => {
            updateBookings();
            const isPostRequest = method === frontendPusher.bookingUpdateMethod.POST
            const snackString = `${username} ${isPostRequest ? ' bokade ' : ' avbokade '} ${DateUtils.toLaundryBookingString(new Date(startTime), timeSlot)}`
            const myBooking = username == user.name
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
            console.log("Unsubscribing from channel: ", channel)
            frontendPusher.cleanup();
        }
    }, [laundryBuilding])


    const handleRenderDay = (day: Date, _value: Date[], DayComponentProps: PickersDayProps<Date>): JSX.Element => {
        if (DateUtils.isOldDate(day)) {
            return <PickersDay {...DayComponentProps} />;
        }

        const nbrBookedTimes = BookingsUtil.countBookingsForDay(bookings, day);
        const hasUserBooking = user.hasBookingOnDay(day)

        if (isFullyBooked(nbrBookedTimes) && hasUserBooking) {
            return renderFullyBookedDayWithUserBooking(DayComponentProps);
        } else if (!isFullyBooked(nbrBookedTimes) && hasUserBooking) {
            return renderDayWithUserBooking(DayComponentProps);
        } else if (isFullyBooked(nbrBookedTimes)) {
            return renderFullyBookedDay(DayComponentProps);
        } else {
            return <PickersDay {...DayComponentProps} />;
        }
    };

    const isFullyBooked = (nbrBookedTimes: number) => nbrBookedTimes === config.timeSlots.length;

    const renderFullyBookedDayWithUserBooking = (DayComponentProps: PickersDayProps<Date>) => (
        <Badge
            key={DayComponentProps.day.toString()}
            color={"secondary"}
            badgeContent={""}
            overlap="circular"
            variant="dot"
        >
            <PickersDay
                sx={fullyBookedDayStyle}
                {...DayComponentProps}
            />
        </Badge>
    );

    const renderDayWithUserBooking = (DayComponentProps: PickersDayProps<Date>) => (
        <Badge
            key={DayComponentProps.day.toString()}
            color={"secondary"}
            badgeContent={""}
            overlap="circular"
            variant="dot"
        >
            <PickersDay {...DayComponentProps} />
        </Badge>
    );

    const renderFullyBookedDay = (DayComponentProps: PickersDayProps<Date>) => (
        <PickersDay
            sx={fullyBookedDayStyle}
            {...DayComponentProps}
        />
    );

    const fullyBookedDayStyle = {
        "&.MuiPickersDay-root": {
            color: "#FFFFFF",
            backgroundColor: "#e65b62",
            '&:hover': {
                backgroundColor: "#e13740"
            }
        }
    };


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
        <BookingButtonGroup
            bookedBookings={BookingsUtil.getBookingsByDate(bookings, selectedDate)}
            selectedDate={selectedDate} user={user} updateBookings={updateBookings}
            snackTrigger={snackTrigger}
            config={config}
        />
    )

    const todaysDateMinus2Days = new Date(new Date().setDate(new Date().getDate() - 2));
    return (
        <Grid
            container
            maxWidth={600}
        >
            <Grid item xs={12} sx={{mb: "2px"}}>
                <Grid container justifyContent="flex-end">

                    <Button disableElevation={true}
                            variant={laundryBuilding === LaundryBuilding.NATIONSHUSET ? "contained" : "outlined"}
                            onClick={() => handleBuildingChange(LaundryBuilding.NATIONSHUSET)}>
                        Nationshuset
                    </Button>
                    <Button disableElevation={true}
                            variant={laundryBuilding === LaundryBuilding.ARKIVET ? "contained" : "outlined"}
                            onClick={() => handleBuildingChange(LaundryBuilding.ARKIVET)}
                            sx={{ml: "4px"}}>
                        Arkivet
                    </Button>
                </Grid>
            </Grid>
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
                    <BookedTimes user={user} activeUserBookings={user.activeBookings} snackTrigger={snackTrigger}/>
                </Grid>
            </Grid>
        </Grid>
    );
}
export default BookingCalendar;
