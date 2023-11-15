import * as React from 'react';
import type {NextPage} from 'next';
import {Grid} from '@mui/material';
import BookingCalendar from '../src/components/index/calendar/BookingCalendar';
import Terms from '../src/components/Terms';
import Rules from '../src/components/rules/Rules';
import Layout from '../src/components/layout/Layout';
import {getSession, withPageAuthRequired} from '@auth0/nextjs-auth0';
import {connect} from "../utils/connection";
import Bookings from '../src/classes/Bookings';
import MongooseBooking from '../src/backend/mongooseModels/MongooseBooking';
import {UserType} from '../utils/types';
import User from '../src/classes/User';
import {getBuilding} from '../utils/helperFunctions';

interface Props {
    user: UserType;
    fetchedBookings: string; // Update the type of 'bookings' array according to your MongooseBooking model
}

const Index: NextPage<Props> = ({user, fetchedBookings}: Props) => {
    const bookings = Bookings.fromJSON(JSON.parse(fetchedBookings));
    const userFromType = User.fromJSON(user)
    const [currentUser, setCurrentUser] = React.useState<User>(userFromType);


    return (
        <Layout user={currentUser}>
            <Terms user={user}/>
            <Rules/>
            <Grid container px={1} marginY={10}>
                <BookingCalendar title="" user={user} initalBookings={bookings}/>
            </Grid>
        </Layout>
    );
};

export const getServerSideProps = withPageAuthRequired({
    // returnTo: '/unauthorized',
    async getServerSideProps(ctx) {
        //If session is need
        const session = await getSession(ctx.req, ctx.res);

        await connect();
        const bookingsFromLastTwoDays = await MongooseBooking.find({date: {$gte: new Date(new Date().setDate(new Date().getDate() - 2))}});

        const buildingBookings = bookingsFromLastTwoDays.filter((booking) => {
            const userBuilding = getBuilding(session?.user.name)
            const bookingBuilding = getBuilding(booking.userName)
            return userBuilding === bookingBuilding
        })

        return {
            props: {
                fetchedBookings: JSON.stringify(buildingBookings),
            },
        };
    },
});

export default Index;
