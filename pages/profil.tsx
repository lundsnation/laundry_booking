import { Grid } from "@mui/material";
import { useUser } from '@auth0/nextjs-auth0/client';
import { NextPage } from "next";
import { useState } from "react";
import { UserType } from "../utils/types"
import { Snack, SnackInterface } from "../src/components/Snack";
import EditProfile from "../src/components/profile/EditProfile";
import Loading from "../src/components/Loading";
import router from "next/router";
import Layout from "../src/components/layout/Layout";

const Profile: NextPage = () => {
    const { user, isLoading, error } = useUser()
    const [snack, setSnack] = useState<SnackInterface>({
        show: false,
        snackString: "",
        severity: "success"
    })

    const resetSnack = () => {
        setSnack({ show: false, snackString: snack.snackString, severity: snack.severity })
    }

    if (isLoading) return <Loading />
    if (error) return <div>{error.message}</div>
    if (!user) {
        router.push('/api/auth/login')
        return null
    } else {
        return (
            <Layout user={user as UserType}>
                <Snack state={snack} handleClose={resetSnack} />
                <Grid container>
                    <Grid item xs={12} mx={2} my={'10%'}>
                        <EditProfile user={user as UserType} setSnack={setSnack} />
                    </Grid>

                </Grid>
            </Layout >
        )
    }
}

export default Profile