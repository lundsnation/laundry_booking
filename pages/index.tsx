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
import { UserType } from '../utils/types';
import { Users } from '../src/classes/Users';
import User from '../src/classes/User';

interface Props {
	user: UserType;
	fetchedBookings: string; // Update the type of 'bookings' array according to your Booking model
	fetchedUsers: string;
}

const Index: NextPage<Props> = ({ user, fetchedBookings, fetchedUsers }: Props) => {
	const bookings = Bookings.fromJSON(JSON.parse(fetchedBookings));
	const userJson = User.fromJSON(user)
	const [currentUser, setCurrentUser] = React.useState<User>(userJson);
	const handleSetCurrentUser = (user: User) => {
		setCurrentUser(user);
	};

	return (
		<Layout user={user as UserType}>
			<Terms user={user} handleSetCurrentUser={handleSetCurrentUser} />
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
		//If session is need
		//const session = await getSession(ctx.req, ctx.res);

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
