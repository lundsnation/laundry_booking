import * as React from 'react';
import { useEffect } from "react";
import type { NextPage } from 'next';
import {Container, Typography, Box, Button, Grid} from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/dist/frontend';
import Header from '../src/components/Header'
import BookingSchema from '../models/Booking'
import BookingCalendar from '../src/components/BookingCalendar';
import { useRouter } from 'next/router'
import { Booking } from "../utils/types"
import {connect} from "../utils/connection"



interface IndexProps {
  bookings: string
}

const Index: NextPage<IndexProps> = (props: IndexProps) => {
  const { user, isLoading, error } = useUser()
  const router = useRouter()

  //Detta är ett hack för att få det att funka. Det är egentligen strängar
  const bookings: Array<Booking> = JSON.parse(props.bookings) 

  const initBookings: Array<Booking> = [];
  bookings.forEach(booking => {
      const tmpBooking = {
          _id : booking._id,
          userName : booking.userName,
          date : new Date(booking.date),
          timeSlot : booking.timeSlot,
      }
      initBookings.push(tmpBooking);
  });

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
            {<BookingCalendar title="Tvättbokning - GH/NH" user = {user} initBookings = { initBookings }/>}
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