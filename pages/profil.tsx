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

    const resetSnack = () => {
        setSnack({ show: false, snackString: snack.snackString, severity: snack.severity })
    }

    return (user ?
        <Layout>
            <Snack state={snack} handleClose={resetSnack} />
            <Grid container>
                <Grid item xs={12} mx={2} my={'10%'}>
                    <EditProfile user={user as UserType} setSnack={setSnack} />
                </Grid>

            </Grid>
        </Layout > : <Loading />
    )
}


export default Profile