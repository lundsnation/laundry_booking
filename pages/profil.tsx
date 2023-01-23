import { Grid, Paper, AlertColor, SnackbarOrigin, Box } from "@mui/material";
import { useUser } from '@auth0/nextjs-auth0/client';
import { NextPage } from "next";
import Header from "../src/components/layout/header/Header";
import Footer from "../src/components/layout/Footer";
import { useEffect, useState } from "react";
import BookedTimes from "../src/components/BookedTimes";
import { Booking, UserType } from "../utils/types"
import { Snack, SnackInterface } from "../src/components/Snack";
import EditProfile from "../src/components/profile/EditProfile";
import { pusherClient } from "../utils/pusherAPI";
import Loading from "../src/components/Loading";
import router from "next/router";



const img = process.env.AUTH0_BASE_URL as string + "/logotyp02.png"
const styles = {
    paperContainer: {
        backgroundImage: `url(${img})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100%',
    }
}

console.log("Outside of profile");
const Profile: NextPage = () => {
    console.log("Inside of profile");

    const { user, isLoading, error } = useUser()
    const [bookings, setBookings] = useState<Array<Booking>>([])
    const [snack, setSnack] = useState<SnackInterface>({
        show: false,
        snackString: "",
        severity: "success"
    })



    const updateBookings = async () => {
        const res = await fetch("/api/bookings")
        const resBooking: Array<Booking> = await res.json();
        const bookings: Array<Booking> = [];
        resBooking.forEach(booking => {
            const tmpBooking = { ...booking, date: new Date(booking.date) }
            bookings.push(tmpBooking);
        });
        setBookings(bookings);
    }

    useEffect(() => {
        if (!(user || isLoading)) {
            router.push('api/auth/login')
        }
    }, [user, isLoading])

    useEffect(() => {
        updateBookings()
        const pusher = pusherClient()
        console.log("Useeffect in profile");
        const pusherChannel = pusher.subscribe("bookingUpdates");
        pusherChannel.bind('bookingUpdate', (data: any) => { updateBookings() })
        //cleanup function
        return () => {
            pusher.unbind("bookingUpdate");
            pusher.unsubscribe("bookingUpdates");
            pusher.disconnect();
        }
    }, [])

    const resetSnack = () => {
        setSnack({ show: false, snackString: snack.snackString, severity: snack.severity })
    }

    const snackTrigger = (severity: AlertColor, snackString: string, alignment: SnackbarOrigin) => {
        setSnack({ show: true, snackString: snackString, severity: severity })
    }

    return (user ?
        <Grid container justifyContent='center'>
            <Snack state={snack} handleClose={resetSnack} />
            <Grid item xs={12} flexGrow={1} sx={{ display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
                <Grid container alignItems="flex-end" justifyContent={'center'}>
                    <Grid container alignItems="flex-end" rowSpacing={2} sx={{ width: { xs: "100%", sm: "75%", md: "50%" } }}>
                        <Grid item xs={12}>
                            <EditProfile user={user as UserType} setSnack={setSnack} />
                        </Grid>
                        <Grid item xs={12}>
                            <BookedTimes
                                bookings={bookings}
                                user={user as UserType}
                                snackTrigger={snackTrigger} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Snack state={snack} handleClose={resetSnack} />
        </Grid > : <Loading />
    )
}


export default Profile