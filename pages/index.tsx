import * as React from 'react';
import type { NextPage } from 'next';
import { Grid } from '@mui/material';
import BookingCalendar from '../src/components/index/calendar/BookingCalendar';
import Terms from '../src/components/Terms';
import Rules from '../src/components/rules/Rules';
import Layout from '../src/components/layout/Layout';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { connect } from "../utils/connection";
import Bookings from '../src/classes/Bookings';
import Booking from '../models/Booking';

interface Props {
	user: UserType;
	fetchedBookings: string; // Update the type of 'bookings' array according to your Booking model
}

const Index: NextPage<Props> = ({ user, fetchedBookings }: Props) => {

	const bookings = Bookings.fromJSON(JSON.parse(fetchedBookings));
	console.log(bookings)

	console.log(user)
	console.log(bookings)
	console.log("====================================\n", user.app_metadata?.roles, "\n====================================")

	return (
		<Layout user={user}>
			<Terms user={user} />
			<Rules />
			<Grid container px={1} marginY={10}>
				<BookingCalendar title="" user={user} initalBookings={bookings} />
			</Grid>
		</Layout>
	);
};

export const getServerSideProps = withPageAuthRequired({
	// returnTo: '/unauthorized',
	async getServerSideProps(ctx) {
		const session = await getSession(ctx.req, ctx.res);
		console.log(session?.user.name)
		await connect();
		const bookings = await Booking.find({});
		return {
			props: {
				fetchedBookings: JSON.stringify(bookings),
			},
		};
	},
});

export default Index;
