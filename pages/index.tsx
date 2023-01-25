import * as React from 'react';
import { useEffect } from "react";
import type { NextPage } from 'next';
import { Box, Grid, Paper } from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/client';
import Header from "../src/components/layout/header/Header";
import BookingCalendar from '../src/components/calendar/BookingCalendar';
import { useRouter } from 'next/router'
import Footer from '../src/components/layout/Footer';
import Terms from '../src/components/Terms';
import { UserType } from '../utils/types';
import Loading from '../src/components/Loading';
import Rules from '../src/components/rules/Rules';
import Layout from '../src/components/layout/Layout';

const img = process.env.AUTH0_BASE_URL as string + "/logotyp02.png"
const styles = {
  paperContainer: {
    backgroundImage: `url(${img})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
  }
}


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

      <Grid container justifyContent={'center'} pt={3}>
        <BookingCalendar title="" user={user as UserType} />
      </Grid>

    </Layout> : <Loading />
  )
}

export default Index;