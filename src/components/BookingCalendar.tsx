import { LocalizationProvider, PickersDay, StaticDatePicker, DatePicker } from "@mui/lab";
import { useState, useEffect } from "react";
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import { Badge, Container, Grid, Stack, TextField, Typography } from "@mui/material";
import svLocale from 'date-fns/locale/sv';
import BookingButtonGroup from "./BookingButtonGroup";
import { fetchTimes } from "../../utils/fetchTimes"
import { Booking } from "../../utils/types";
import { conv } from "../../utils/conv";
import { UserProfile } from "@auth0/nextjs-auth0";
import getDayOfYear from "date-fns/getDayOfYear";

interface Props {
    title: String;
    user: UserProfile;
}
//Program parameters 
const MINH = 7;
const MAXH = 22;
const NSLOTS = 10;


const BookingCalendar = (props: Props) => {
    const converter = new conv(MINH, MAXH, NSLOTS, new Date());
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [showButtons, setShowButtons] = useState<boolean>(false);
    const [bookedTimes, setBookedTimes] = useState<Array<Booking>>([]);
    useEffect(() => {
        const fetch = async () => {
            const data = await fetchTimes(converter)
            setBookedTimes(data)
            setShowButtons(true)
        }
        fetch().catch(console.error)
    }, [])
    const user = props.user
    const times: Array<string> = ["07:00-08:30",
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
            <BookingButtonGroup selectedDate={selectedDate} times={times} booked={bookedTimes} user={user} converter={converter} />
        </Grid>
    )
    let loadingText = (
        <Typography variant="body1" align="center">Laddar...</Typography>
    )

    let dayColor = "white"

    return (
        <div>
            <Typography sx={{ m: 3 }} variant="h3" component="h2" align="center"> {props.title} </Typography>
            <Grid container spacing={1} direction="row" justifyContent="center" alignItems="left">
                <Grid item xs="auto" >
                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={svLocale}>
                        <StaticDatePicker<Date>
                            orientation="landscape"
                            displayStaticWrapperAs="desktop"
                            openTo="day"
                            showDaysOutsideCurrentMonth={true}
                            views={['day']}
                            showToolbar={true}
                            value={selectedDate}
                            toolbarTitle={"Valt Datum: "}
                            allowSameDateSelection={true}
                            onChange={async (date) => {
                                setShowButtons(false)
                                date && converter.setDate(date)
                                date && setBookedTimes(await fetchTimes(converter))
                                date && setSelectedDate(date)
                                setShowButtons(true)
                            }
                            }
                            renderInput={(params) => <TextField {...params} />}
                            renderDay={(day, _value, DayComponentProps) => {
                                let isBooked = false;

                                const calendarDayInYear = getDayOfYear(day);
                                const currentDayBookings = bookedTimes.map(time => {
                                    if (getDayOfYear(time.date) === calendarDayInYear) {
                                        time
                                    } else { null }
                                })
                                let newBookingListLength = 0
                                currentDayBookings.forEach(time => {
                                    if (time !== null) {
                                        newBookingListLength++
                                    }
                                })

                                if (newBookingListLength === times.length) { isBooked = !isBooked }

                                return (
                                    <Badge
                                        key={day.toString()}
                                        overlap="circular"
                                        badgeContent={isBooked ? '🔴' : undefined}
                                    >
                                        <PickersDay {...DayComponentProps}
                                            sx={{
                                                color: {
                                                    backgroundColor: dayColor
                                                }
                                            }}
                                        />
                                    </Badge>
                                );

                            }}
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