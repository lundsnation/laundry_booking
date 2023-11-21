import React, {useState, useEffect} from 'react';
import type {NextPage} from 'next';
import {Grid} from '@mui/material';
import BookingCalendar from '../src/components/index/calendar/BookingCalendar';
import Terms from '../src/components/Terms';
import Rules from '../src/components/rules/Rules';
import Layout from '../src/components/layout/Layout';
import User, {JsonUser} from '../src/classes/User';
import ArkivetConfig from "../src/Configs/ArkivetConfig";
import NationshusetConfig from "../src/Configs/NationshusetConfig";
import {useUser} from '@auth0/nextjs-auth0/client';
import Loading from "../src/components/Loading";
import router from 'next/router';
import backendAPI from "../utils/BackendAPI";
import Booking from "../src/classes/Booking";
// ... other imports


const Index: NextPage = () => {
    const {user, error, isLoading: userIsLoading} = useUser();
    const [initialBookings, setInitialBookings] = useState<Booking[]>([]);
    const [userBookings, setUserBookings] = useState<Booking[]>([]);
    const [fetchingBookings, setFetchingBookings] = useState<boolean>(false);

    useEffect(() => {
        if (user && !userIsLoading) {
            // Fetch initial bookings here
            fetchData().then(r => console.log("Initial bookings fetched"));
        }
    }, [user, userIsLoading]);

    console.log(user)

    if (userIsLoading || fetchingBookings) return <Loading/>;
    if (error) return <div>{error.message}</div>;
    if (!user) {
        router.push('/api/auth/login');
        return null; // Add this to prevent the component from rendering further
    }

    // Use optional chaining to handle cases where user might be undefined
    const userClass = new User(user as JsonUser,);

    const config = userClass.building === 'ARKIVET' ? new ArkivetConfig() : new NationshusetConfig();

    const fetchData = async () => {
        try {
            setFetchingBookings(true);
            // Make your API call to fetch initial bookings
            // For example, if you have a method like fetchInitialBookings
            const bookings = await backendAPI.fetchBookings();
            const userBookings = await backendAPI.fetchBookingsByUser(userClass.name);
            setInitialBookings(bookings);
        } catch (error) {
            console.error("Error fetching initial bookings:", error);
        } finally {
            setFetchingBookings(false);
        }
    };

    return (
        <Layout user={userClass}>
            <Terms user={userClass}/>
            <Rules/>
            <Grid container px={1} marginY={10}>
                <BookingCalendar user={userClass} config={config} initialBookings={initialBookings}/>
            </Grid>
        </Layout>
    );
}

export default Index;
