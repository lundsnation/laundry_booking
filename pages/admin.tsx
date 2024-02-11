import React, {useEffect} from 'react';
import {useUser} from '@auth0/nextjs-auth0/client';
import router from 'next/router';
import {Grid} from '@mui/material';
import Layout from '../src/components/layout/Layout';
import UserGrid from '../src/components/admin/UserGrid';
import User, {JsonUser} from '../src/classes/User';
import Loading from '../src/components/Loading';

const Admin = () => {
    const {user, error, isLoading: userIsLoading} = useUser();

    useEffect(() => {
        if (!userIsLoading && user) {
            const currentUser = new User(user as JsonUser);
            if (!currentUser.app_metadata.roles.includes('admin')) {
                // Redirect to login or unauthorized page if the user is not an admin
                router.push('/index').then();
                return; // Prevent further execution
            }
        }
    }, [user, userIsLoading]);

    if (userIsLoading) {
        // Render loading state while checking user authentication
        return <Loading/>;
    }
    if (error) return <div>{error.message}</div>;
    if (!user) {
        // Redirect to login page if user is not authenticated
        router.push('/api/auth/login').then();
        return null; // Prevent further rendering until redirection is complete
    }

    const currentUser = new User(user as JsonUser);

    return (
        <Layout user={currentUser}>
            <Grid container justifyContent="center">
                <Grid item xs={12} sx={{px: {xs: 1}}}>
                    <UserGrid/>
                </Grid>
            </Grid>
        </Layout>
    );
};

export default Admin;
