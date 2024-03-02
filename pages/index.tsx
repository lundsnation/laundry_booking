import React, {useState, useEffect, useCallback} from 'react';
import type {NextPage} from 'next';
import {Grid} from '@mui/material';
import BookingCalendar from '../src/frontend/components/index/calendar/BookingCalendar';
import Terms from '../src/frontend/components/Terms';
import Rules from '../src/frontend/components/rules/Rules';
import Layout from '../src/frontend/components/layout/Layout';
import User, {JsonUser} from '../src/frontend/models/User';
import ConfigUtil from "../src/frontend/utils/ConfigUtil";
import {useUser} from '@auth0/nextjs-auth0/client';
import Loading from "../src/frontend/components/Loading";
import router from 'next/router';
import backendAPI from "../src/apiHandlers/BackendAPI";
import Booking from "../src/frontend/models/Booking";
import {isAxiosError} from "axios";
import useAsyncError from "../src/frontend/errorHandling/asyncError";


const Index: NextPage = () => {
    const {user, error, isLoading: userIsLoading} = useUser();
    const [initialBookings, setInitialBookings] = useState<Booking[]>([]);
    const [fetchingData, setFetchingData] = useState<boolean>(false);
    const throwAsyncError = useAsyncError();

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
    }, [setFetchingData, setInitialBookings, throwAsyncError]); // Add all dependencies here

    useEffect(() => {
        if (user && !userIsLoading) {
            fetchData();
        }
    }, [user, userIsLoading, fetchData]); // fetchData is stable now


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
