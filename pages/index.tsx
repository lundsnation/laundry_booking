import * as React from 'react';
import type { NextPage } from 'next';
import { Grid } from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/client';
import BookingCalendar from '../src/components/index/calendar/BookingCalendar';
import Terms from '../src/components/Terms';
import { UserType } from '../utils/types';
import Rules from '../src/components/rules/Rules';
import Layout from '../src/components/layout/Layout'
import { useRouter } from 'next/router';
import Loading from '../src/components/Loading';

const Index: NextPage = () => {
	const { user, error, isLoading } = useUser();
	const router = useRouter()

	if (isLoading) return <Loading />
	if (error) return <div>{error.message}</div>
	if (!user) {
		router.push('/api/auth/login')
		return null
	} else {
		return (
			<Layout>
				<Terms user={user as UserType} />
				<Rules />
				<Grid container px={1} marginY={10}>
					<BookingCalendar title="" user={user as UserType} />
				</Grid>

			</Layout>
		)
	}
}

export default Index;