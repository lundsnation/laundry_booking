import React, {useState, useEffect} from 'react';
import type {NextPage} from 'next';
import {Grid} from '@mui/material';
import BookingCalendar from '../src/frontend/components/index/calendar/BookingCalendar';
import Terms from '../src/frontend/components/Terms';
import Rules from '../src/frontend/components/rules/Rules';
import Layout from '../src/frontend/components/layout/Layout';
import User, {JsonUser} from '../src/frontend/classes/User';
import ConfigUtil from "../src/frontend/utils/ConfigUtil";
import {useUser} from '@auth0/nextjs-auth0/client';
import Loading from "../src/frontend/components/Loading";
import router from 'next/router';
import backendAPI from "../src/apiHandlers/BackendAPI";
import Booking from "../src/frontend/classes/Booking";


const Index: NextPage = () => {
    const {user, error, isLoading: userIsLoading} = useUser();
    const [initialBookings, setInitialBookings] = useState<Booking[]>([]);
    const [fetchingData, setFetchingData] = useState<boolean>(false);

    const fetchData = async () => {
        setFetchingData(true);

        const bookings = await backendAPI.fetchBookings();
        setInitialBookings(bookings);

        setFetchingData(false);
    }

    console.log("User, error, userIsLoading: ", user);

    useEffect(() => {
        if (user && !userIsLoading) {
            // Fetch initial bookings here
            fetchData().then(() => console.log("fetchData is done"));
        }
    }, [user, userIsLoading]);

    if (userIsLoading || fetchingData) return <Loading/>;
    if (error) return <div>{error.message}</div>;
    if (!user) {
        router.push('/api/auth/login').then();
        return null; // Add this to prevent the component from rendering further
    }

    const userClass = new User(user as JsonUser, initialBookings)
    const config = ConfigUtil.getLaundryConfigByLaundryBuilding(userClass.app_metadata.laundryBuilding)
    return (
        <Layout user={userClass}>
            <Terms user={userClass}/>
            <Rules/>
            <Grid container px={1} marginY={10}>
                <BookingCalendar config={config} user={userClass} initialBookings={initialBookings}/>
            </Grid>
        </Layout>
    );
}

export default Index;
