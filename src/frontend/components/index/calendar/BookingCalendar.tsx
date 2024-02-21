import {LocalizationProvider, PickersDay, PickersDayProps, StaticDatePicker} from '@mui/x-date-pickers';
import React, {useCallback, useEffect, useRef, useState} from "react";
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


    //This should not have a dependency array as the cleanup function should only be called once on component unmount,
    // and not everytime user.app_metadata.laundryBuilding changes
    useEffect(() => {
        if (!frontendPusher.current) {
            frontendPusher.current = new FrontendPusher();
        }
        return () => {
            frontendPusher.current!.cleanup(user.app_metadata.laundryBuilding);
        };
        //Don't add user.app_metadata.laundryBuilding as a dependency here, as it will cause the cleanup function to be called
        // everytime the building changes, which is not the intended behavior.
    }, []);


    const updateBookings = useCallback(async () => {
        try {
            const bookings = await BackendAPI.fetchBookingsForBuilding(user.app_metadata.laundryBuilding);
            setBookings(bookings);
            // Assuming setUserBookings updates the user object with the new bookings
            // This might need adjustment depending on how user state is managed
            user.setUserBookings(bookings);
        } catch (e) {
            //This will be caught by the ErrorBoundary. Can be tweaked to use more specific error messages.
            // For example the error itself can be thrown or information from it.
            throwAsyncError(new Error("Failed to fetch bookings for building: " + user.app_metadata.laundryBuilding));
        }
    }, [user, throwAsyncError]);

    const handleBuildingChange = useCallback((building: LaundryBuilding) => {
        // Unsubscribe from the current building's updates
        if (frontendPusher.current) {
            frontendPusher.current.bookingUpdateUnsubscribe(user.app_metadata.laundryBuilding);
        }

        // Update the user object and its state
        const updatedUser = {
            ...user.toJSON(),
            app_metadata: {
                ...user.app_metadata,
                laundryBuilding: building
            }
        };

        setUser(new User(updatedUser));

        // Re-subscribe to the new building's updates
        // This logic has been moved to ensure subscriptions are always correctly managed
        updateBookings(); // Fetch new bookings for the updated building
    }, [updateBookings, user]);

    useEffect(() => {
        const currentFrontendPusher = frontendPusher.current!;
        updateBookings().then();
        const channel = currentFrontendPusher.bookingUpdatesSubscribe(user.app_metadata.laundryBuilding);
        channel.bind(currentFrontendPusher.bookingUpdateEvent, ({
                                                                    username,
                                                                    startTime,
                                                                    timeSlot,
                                                                    method
                                                                }: BookingUpdate) => {
            updateBookings().then();
            const isPostRequest = method === currentFrontendPusher.bookingUpdateMethod.POST
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
    }, [user.app_metadata.laundryBuilding, user.name, updateBookings])


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
            {isAdmin &&
                (
                    <Grid item xs={12} sx={{mb: "2px"}}>
                        <Grid container justifyContent="flex-end">

                            <Button disableElevation={true}
                                    variant={user.app_metadata.laundryBuilding === LaundryBuilding.NATIONSHUSET ? "contained" : "outlined"}
                                    onClick={() => handleBuildingChange(LaundryBuilding.NATIONSHUSET)}>
                                Nationshuset
                            </Button>
                            <Button disableElevation={true}
                                    variant={user.app_metadata.laundryBuilding === LaundryBuilding.ARKIVET ? "contained" : "outlined"}
                                    onClick={() => handleBuildingChange(LaundryBuilding.ARKIVET)}
                                    sx={{ml: "4px"}}>
                                Arkivet
                            </Button>
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
