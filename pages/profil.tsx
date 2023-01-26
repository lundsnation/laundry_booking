import { Grid, Paper, AlertColor, SnackbarOrigin, Box } from "@mui/material";
import { useUser } from '@auth0/nextjs-auth0/client';
import { NextPage } from "next";
import { useEffect, useState } from "react";
import BookedTimes from "../src/components/BookedTimes";
import { Booking, UserType } from "../utils/types"
import { Snack, SnackInterface } from "../src/components/Snack";
import EditProfile from "../src/components/profile/EditProfile";
import { pusherClient } from "../utils/pusherAPI";
import Loading from "../src/components/Loading";
import router from "next/router";
import Layout from "../src/components/layout/Layout";



const img = "/logotyp02.png"
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
    const [userBookings, setUserBookings] = useState<Array<Booking>>([])
    const [snack, setSnack] = useState<SnackInterface>({
        show: false,
        snackString: "",
        severity: "success"
    })

    useEffect(() => {
        if (!(user || isLoading)) {
            router.push('api/auth/login')
        }
    }, [user, isLoading])

    const updateUserBookings = async () => {
        const jsonBookings: Array<Booking> = await (await fetch("/api/bookings")).json()
        const userBookings: Array<Booking> = jsonBookings.filter(booking => booking.userName === user?.name)
            .map(booking => (
                { ...booking, date: new Date(booking.date) }
            ));

        setUserBookings(userBookings);
    }

    useEffect(() => {
        updateUserBookings()
        const pusher = pusherClient()
        const pusherChannel = pusher.subscribe("bookingUpdates");
        pusherChannel.bind('bookingUpdate', (data: any) => { updateUserBookings() })
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
        <Layout>

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
                                    userBookings={userBookings}
                                    user={user as UserType}
                                    snackTrigger={snackTrigger} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Snack state={snack} handleClose={resetSnack} />
            </Grid >

        </Layout> : <Loading />
    )
}


export default Profile