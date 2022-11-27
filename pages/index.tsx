import * as React from 'react';
import { useEffect } from "react";
import type { NextApiRequest, NextPage } from 'next';
import {Container, Typography, Box, Button, Grid} from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/dist/frontend';
import Header from '../src/components/Header'
import BookingSchema from '../models/Booking'
import BookingCalendar from '../src/components/BookingCalendar';
import { useRouter } from 'next/router'
import { Booking } from "../utils/types"
import {connect} from "../utils/connection"

interface IndexProps {
  bookings: Array<Booking>
}

const Index: NextPage<IndexProps> = (props: IndexProps) => {

  const  bookings  = JSON.parse(props.bookings);
  const { user, isLoading, error } = useUser()
  const router = useRouter()

  //Se över denna
  useEffect(() => {
    if (!(user || isLoading)) {
      router.push('api/auth/login')
    }
  }, [user, isLoading])

  return( user ? 
   <Container maxWidth="lg">
        <Grid container spacing = {10}>
        <Grid item xs={12}>
            <Header/> 
        </Grid>    
        <Grid item xs={12}>
            {<BookingCalendar title="Tvättbokning - GH/NH" user = {user} bookings = { bookings }/>}
        </Grid> 
        </Grid>       
    </Container> : <Typography>Laddar...</Typography>
   )
}


export async function getServerSideProps() {
  // get todo data from API
  await connect()
  const res = await BookingSchema.find({})
  const bookings = JSON.stringify(res)

  // return props
  return {
    props:  {bookings} ,
  }
}


export default Index;