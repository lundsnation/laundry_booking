import React, {useState, useEffect, useCallback} from 'react';
import {NextPage} from 'next';
import {Grid} from '@mui/material';
import BookingCalendar from '../src/frontend/components/index/calendar/BookingCalendar';
import Terms from '../src/frontend/components/Terms';
import Rules from '../src/frontend/components/rules/Rules';
import Layout from '../src/frontend/components/layout/Layout';
import User, {JsonUser} from '../src/frontend/models/User';
import ConfigUtil from "../src/frontend/utils/ConfigUtil";
import {useUser} from '@auth0/nextjs-auth0/client';
import Loading from "../src/frontend/components/Loading";
import {useRouter} from 'next/router';
import backendAPI from "../src/apiHandlers/BackendAPI";
import Booking from "../src/frontend/models/Booking";
import {isAxiosError} from "axios";
import useAsyncError from "../src/frontend/errorHandling/asyncError";

const Index: NextPage = () => {
    const {user, error, isLoading: userIsLoading} = useUser();
    const [initialBookings, setInitialBookings] = useState<Booking[]>([]);
    const [fetchingData, setFetchingData] = useState<boolean>(false);
    const throwAsyncError = useAsyncError();
    const router = useRouter(); // Using the useRouter hook for redirection

    console.log("Index page rendered")

    // Ensures logout after 10 minutes of inactivity and disconnect from pusher channels, so limit is not reached.
    const handleUserActivity = () => {
        // Reset the timer on user activity
        clearTimeout(inactivityTimeout);
        // Set a new timer for auto logout after 5 minutes
        inactivityTimeout = setTimeout(() => {
            window.location.href = "/api/auth/logout";
        }, 15 * 60 * 1000); // 15 minutes in milliseconds
    };

    // Timer variable to track inactivity
    let inactivityTimeout: NodeJS.Timeout;

    // Add event listener for user activity on component mount
    useEffect(() => {
        // Initial setup on component mount
        handleUserActivity();

        // Add event listener for user activity
        document.addEventListener('click', handleUserActivity);

        // Cleanup function to remove event listener on component unmount
        return () => {
            document.removeEventListener('click', handleUserActivity);
        };
    });

    const fetchData = useCallback(async () => {
        try {
            setFetchingData(true);
            const bookings = await backendAPI.fetchBookings();
            setInitialBookings(bookings);
        } catch (e) {
            if (isAxiosError(e)) {
                throwAsyncError(e);
            } else {
                throwAsyncError(new Error("An unexpected error occurred. Please try again."));
            }
        } finally {
            setFetchingData(false);
        }
    }, [throwAsyncError]);

    useEffect(() => {
        if (user && !userIsLoading) {
            console.log("User", user)
            console.log("User is loading", userIsLoading)
            console.log("Fetching data")
            fetchData();
        }
    }, [user, userIsLoading, fetchData]);

    useEffect(() => {
        if (!userIsLoading && !user) {
            console.log("Redirecting to login")
            router.push('/api/auth/login');
        }
    }, [user, userIsLoading, router]); // Handling redirection in useEffect

    if (userIsLoading || fetchingData) {
        return <Loading/>;
    }

    if (error) {
        return <div>{error.message}</div>;
    }

    if (!user) {
        return null;
    }

    const userClass = new User(user as JsonUser, initialBookings);
    const config = ConfigUtil.getLaundryConfigByLaundryBuilding(userClass.app_metadata.laundryBuilding);

    return (
        <Layout user={userClass}>
            <Terms user={userClass}/>
            <Rules/>
            <Grid container px={1} marginY={10}>
                <BookingCalendar config={config} user={userClass} initialBookings={initialBookings}/>
            </Grid>
        </Layout>
    );
};

export default Index;
