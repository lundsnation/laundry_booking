import React, {useState} from 'react';
import {NextPage} from 'next';
import {Grid} from '@mui/material';
import {useUser} from '@auth0/nextjs-auth0/client';
import {useRouter} from 'next/router';

import Layout from '../src/frontend/components/layout/Layout';
import Loading from "../src/frontend/components/Loading"; // Assuming you have a Loading component
import EditProfile from "../src/frontend/components/profile/EditProfile";
import {Snack, SnackInterface} from "../src/frontend/components/Snack";
import User, {JsonUser} from "../src/frontend/models/User";

const Profile: NextPage = () => {
    const {user, isLoading, error} = useUser();
    const router = useRouter();

    const [snack, setSnack] = useState<SnackInterface>({
        show: false,
        snackString: "",
        severity: "success",
    });

    const resetSnack = () => {
        setSnack({show: false, snackString: snack.snackString, severity: snack.severity});
    };

    // Redirect to login if not authenticated
    if (!isLoading && !user) {
        router.push('/api/auth/login');
        return null; // or a <Loading /> component for a better UX until redirection kicks in
    }

    if (error) {
        throw error;
    }

    if (isLoading) {
        return <Loading/>; // Show loading screen while user info is loading
    }

    const currentUser = new User(user as JsonUser, []);

    return (
        <Layout user={currentUser}>
            <Snack state={snack} handleClose={resetSnack}/>
            <Grid container>
                <Grid item xs={12} mx={2} my={'10%'}>
                    <EditProfile initUser={currentUser} setSnack={setSnack}/>
                </Grid>
            </Grid>
        </Layout>
    );
};

export default Profile;
