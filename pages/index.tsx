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
import Booking, {JsonBooking} from "../src/classes/Booking";


const Index: NextPage = () => {
    const {user, error, isLoading: userIsLoading} = useUser();
    const [initialBookings, setInitialBookings] = useState<Booking[]>([]);
    const [userBookings, setUserBookings] = useState<Booking[]>([]);
    const [fetchingData, setFetchingData] = useState<boolean>(false);

    const fetchData = async () => {
        try {
            setFetchingData(true);

            // Use Promise.all to make the API calls concurrently
            const [bookings, userBookings] = await Promise.all([
                backendAPI.fetchBookings(),
                backendAPI.fetchBookingsByUser(userClass.name),
            ]);

            console.log("userBookings:", userBookings);
            console.log("bookings:", bookings);

            setUserBookings(userBookings);
            setInitialBookings(bookings);
        } catch (error) {
            console.error("Error fetching initial bookings:", error);
        } finally {
            setFetchingData(false);
        }
    };

    useEffect(() => {
        if (user && !userIsLoading) {
            // Fetch initial bookings here
            fetchData().then(r => console.log("Initial bookings fetched"));
        }
    }, [user, userIsLoading]);

    console.log("user in index:", user)

    if (userIsLoading || fetchingData) return <Loading/>;
    if (error) return <div>{error.message}</div>;
    if (!user) {
        router.push('/api/auth/login');
        return null; // Add this to prevent the component from rendering further
    }

    const userClass = new User(user as JsonUser, userBookings)
    const config = userClass.building === 'ARKIVET' ? new ArkivetConfig() : new NationshusetConfig();

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
