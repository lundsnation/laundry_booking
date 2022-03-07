import { LocalizationProvider, PickersDay, StaticDatePicker } from "@mui/lab";
import React, { useEffect, useState } from "react";
import AdapterDateFns  from '@mui/lab/AdapterDateFns'
import { Badge, TextField } from "@mui/material";
import svLocale from 'date-fns/locale/sv';
import { getDayOfYear } from 'date-fns';

interface Props {
    title: String;
}

/* relevant props
disablePast={true}
🔴
*/



const BookingCalendar = (props: Props) => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [bookedDates, setBookedDates] = useState<Array<number>>([]);
    //var isBooked: boolean = false;



    const handleAddBokedDate = (date: Date) => {
        setBookedDates((prevBookedDates) => [
            ...prevBookedDates, getDayOfYear(date)
        ])
    }

    const handleRemoveBookedDate = (removeDate: Date) => {
      setBookedDates(bookedDates.filter(date => date !== getDayOfYear(removeDate)))
    };

    
    return (
    <div>
        <h1>{props.title}</h1> 
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={svLocale}>
        <StaticDatePicker<Date>
            orientation="landscape"
            displayStaticWrapperAs="desktop"
            openTo="day"
            showDaysOutsideCurrentMonth={true}
            views={['day']}
            value={selectedDate}
            onChange={(date) => {
            //Sets selectedDate if date is not null
            date && setSelectedDate(date);
            

            if(date) {
              if(!bookedDates.includes(getDayOfYear(date))) {
                handleAddBokedDate(date)
              } else {
                console.log("Got here");
                handleRemoveBookedDate(date)
              }
            }
            //Adds date to bookedDates if date is not null and is not included in bookedDates
            //date && !bookedDates.includes(getDayOfYear(date)) && handleAddBokedDate(date);

            //Removes date from bookedDates if date is not null and is included in bookedDates
            //date && bookedDates.includes(getDayOfYear(date)) && handleRemoveBookedDate(date);

            console.log(bookedDates);
            }}

            renderInput={(params) => <TextField {...params} />}
            renderDay={(day, _value, DayComponentProps) => {
            var isBooked = false;

            const calendarDayInYear = getDayOfYear(day);
            bookedDates.forEach(bookedDayInYear => {
                if(calendarDayInYear === bookedDayInYear)
                    isBooked = true
            });
            

                return (
                  <Badge
                    key={day.toString()}
                    overlap="circular"

                    badgeContent={isBooked ? '🔴' : undefined}
                  >
                    <PickersDay {...DayComponentProps} />
                  </Badge>
                );
            
            }
        }
        />
    </LocalizationProvider>
    </div>
    );
}

export default BookingCalendar;