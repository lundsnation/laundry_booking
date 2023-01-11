import { Grid, Paper, AlertColor, SnackbarOrigin } from "@mui/material";
import { useUser } from '@auth0/nextjs-auth0/client';
import { NextPage } from "next";
import Header from "../src/components/header/Header";
import Footer from "../src/components/Footer";
import { useEffect, useState } from "react";
import BookedTimes from "../src/components/BookedTimes";
import { Booking, UserType } from "../utils/types"
import { Snack, SnackInterface } from "../src/components/Snack";
import EditProfile from "../src/components/profile/EditProfile";
import { pusherClient } from "../utils/pusherAPI";

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


const Profile: NextPage = () => {
    const { user, isLoading, error } = useUser()
    const [bookings, setBookings] = useState<Array<Booking>>([])
    const [snack, setSnack] = useState<SnackInterface>({
        show: false,
        snackString: "",
        severity: "success"
    })
    const pusherChannel = pusherClient.subscribe("bookingUpdates");
    pusherChannel.bind('bookingUpdate', (data: any) => { updateBookings() })

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
        updateBookings()
    }, [])

    const resetSnack = () => {
        setSnack({ show: false, snackString: snack.snackString, severity: snack.severity })
    }

    const snackTrigger = (severity: AlertColor, snackString: string, alignment: SnackbarOrigin) => {
        setSnack({ show: true, snackString: snackString, severity: severity })
    }

    return (
        <Grid container rowSpacing={10}>
            <Snack state={snack} handleClose={resetSnack} />
            <Grid item xs={12} minHeight={100} flexGrow={1}>
                <Header user={user as UserType} />
            </Grid>
            <Grid item xs={12} flexGrow={1} sx={{ display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
                <Grid container alignItems="flex-end">
                    <Paper style={styles.paperContainer}
                        sx={{
                            minHeight: 0,
                            boxShadow: "none",
                            justifyContent: "center",
                            alignItems: "center",
                            display: "flex",
                            opacity: "1"
                        }}>
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
                    </Paper>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
                <Footer />
            </Grid>
            <Snack state={snack} handleClose={resetSnack} />
        </Grid >
    )
}


export default Profile