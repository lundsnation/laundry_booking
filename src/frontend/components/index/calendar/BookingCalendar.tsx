import {LocalizationProvider, PickersDay, PickersDayProps, StaticDatePicker} from '@mui/x-date-pickers';
import React, {useEffect, useRef, useState} from "react";
import AdapterDateFns from '@date-io/date-fns'
import {AlertColor, Badge, Button, Grid, Paper, SnackbarOrigin, TextField} from "@mui/material";
import svLocale from 'date-fns/locale/sv';
import BookingButtonGroup from "./BookingButtonGroup";
import BookedTimes from '../bookedTimes/BookedTimes';
import {Snack, SnackInterface} from "../../Snack"
import {BookingUpdate, FrontendPusher} from '../../../../apiHandlers/PusherAPI'
import BookingsUtil from '../../../utils/BookingsUtil';
import User from "../../../models/User";
import Config, {LaundryBuilding} from "../../../configs/Config";
import Booking from "../../../models/Booking";
import BackendAPI from "../../../../apiHandlers/BackendAPI";
import DateUtils from "../../../utils/DateUtils";
import useAsyncError from "../../../errorHandling/asyncError";
import {isAxiosError} from "axios";

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

const BookingCalendar = ({config, user: initUser, initialBookings}: Props) => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [bookings, setBookings] = useState<Booking[]>(initialBookings);
    const [snack, setSnack] = useState<SnackInterface>(snackInitState)
    const [realtimeSnack, setRealtimeSnack] = useState<SnackInterface>(snackRTState)
    const [user, setUser] = useState<User>(initUser);
    const frontendPusher = useRef<FrontendPusher | null>(null);
    const isAdmin = user.app_metadata.roles.includes("admin");
    const throwAsyncError = useAsyncError(); //Used to propagate errors to ErrorBoundary

    console.log("BookingCalendar rendered")

    //Don't change order of useEffects. Order ensures user unsubscribes and disconnects from Pusher in the correct order.
    useEffect(() => {
        if (frontendPusher.current === null) {
            frontendPusher.current = new FrontendPusher();
        }

        const updateBookings = async () => {
            try {
                const bookings = await BackendAPI.fetchBookingsForBuilding(user.app_metadata.laundryBuilding);
                setBookings(bookings);
                // Assuming setUserBookings updates the user object with the new bookings
                user.setUserBookings(bookings);
            } catch (e) {
                // Error handling
                if (isAxiosError(e)) {
                    throwAsyncError(e);
                } else {
                    throwAsyncError(new Error("An error occurred while fetching bookings"));
                }
            }
        };


        updateBookings().then(); // Initial fetch of bookings
        const currentFrontendPusher = frontendPusher.current;
        const channel = currentFrontendPusher.bookingUpdatesSubscribe(user.app_metadata.laundryBuilding);

        // Correctly binding the event with a callback function
        channel.bind(currentFrontendPusher.bookingUpdateEvent, (data: BookingUpdate) => {
            // Destructuring data inside the function
            const {username, startTime, timeSlot, method} = data;

            updateBookings().then(); // Update bookings on cancel or booking event
            const isPostRequest = method === currentFrontendPusher.bookingUpdateMethod.POST;
            const snackString = `${username} ${isPostRequest ? 'bokade' : 'avbokade'} ${DateUtils.toLaundryBookingString(new Date(startTime), timeSlot)}`;
            const myBooking = username === user.name;
            const alignment: SnackbarOrigin = window.innerWidth > 600 ? {
                vertical: 'bottom',
                horizontal: 'right'
            } : {vertical: 'top', horizontal: 'right'};

            if (!myBooking) {
                setRealtimeSnack({
                    show: true,
                    snackString: snackString,
                    severity: "info",
                    alignment: alignment
                });
            }
        });

        return () => {
            // Cleanup
            console.log("Unsubscribing and unbinding from Pusher");
            currentFrontendPusher.bookingEventUnbind();
            currentFrontendPusher.bookingUpdateUnsubscribe(user.app_metadata.laundryBuilding);
        };
    }, [user, throwAsyncError]); // Dependencies


    //Disconnect only when the component unmounts, not when the user changes building.
    useEffect(() => {
        return () => {
            // Use the captured value in the cleanup function.
            console.log("Disconnecting from Pusher");
            frontendPusher.current!.disconnect();
        };
    }, []);

    const handleBuildingChange = (building: LaundryBuilding) => {
        // Update the user object and its state
        const updatedUser = {
            ...user.toJSON(),
            app_metadata: {
                ...user.app_metadata,
                laundryBuilding: building
            }
        };

        setUser(new User(updatedUser));
    };
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

    const LaundryBuildingButtons = () => {
        return (
            <>
                {Config.getLaundryBuildings.sort().map((building, index) => (
                    <Button key={building}
                            disableElevation={true}
                            variant={user.app_metadata.laundryBuilding === building ? "contained" : "outlined"}
                            onClick={() => handleBuildingChange(building)}
                            sx={{ml: index > 0 ? "4px" : "0px"}}>
                        {building}
                    </Button>
                ))}
            </>
        );
    };

    const bookingButtonGroup = (
        <BookingButtonGroup
            bookedBookings={BookingsUtil.getBookingsByDate(bookings, selectedDate)}
            selectedDate={selectedDate} user={user}
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
            {isAdmin &&
                (
                    <Grid item xs={12} sx={{mb: "2px"}}>
                        <Grid container justifyContent="flex-end">
                            <LaundryBuildingButtons/>
                        </Grid>
                    </Grid>
                )
            }
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
