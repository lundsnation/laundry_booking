import * as React from 'react';
import { useEffect } from "react";
import type { NextPage } from 'next';
import { Grid } from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/client';
import BookingCalendar from '../src/components/index/calendar/BookingCalendar';
import { useRouter } from 'next/router'
import Terms from '../src/components/Terms';
import { UserType } from '../utils/types';
import Loading from '../src/components/Loading';
import Rules from '../src/components/rules/Rules';
import Layout from '../src/components/layout/Layout';


const Index: NextPage = () => {
  const { user, error, isLoading } = useUser();
  const router = useRouter()

  useEffect(() => {
    if (!(user || isLoading)) {
      router.push('api/auth/login')
    }
  }, [user, isLoading])

  return (user ?
    <Layout>

      <Terms user={user as UserType} />
      <Rules />
      <Grid container px={1} marginY={10}>
        <BookingCalendar title="" user={user as UserType} />
      </Grid>

    </Layout> : <Loading />
  )
}

export default Index;