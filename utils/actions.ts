import {conv} from "./conv"
import {Booking} from "../utils/types"
import { UserProfile } from "@auth0/nextjs-auth0";

// General GET API call, returns all stored times in DB. 
// TODO Improve fetchTimes. 
export async function get(converter:conv): Promise<Array<Booking>>{
    const bookedTimes = new Array<Booking>(10);
    const response = await fetch("/api/bookings", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const data = await response.json();
    let timeSlot;
    let tempDate;
    for(let i = 0;i<data.length;i++){
        if(data[i].hasOwnProperty('date')){
            tempDate = new Date(data[i]['date'])
            timeSlot = converter.getTSlot(tempDate)
            if(timeSlot != -1){
                bookedTimes[timeSlot] = data[i]
            }
        }
    }
    return bookedTimes

}
// Function for POST-request to DB 
export async function post(index:number, user:UserProfile, converter:conv){ 
    try{  
    const bookingDate = converter.getDate(index);
    const bookingRequest = {date: bookingDate, userName: user.name}
    const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
           "Content-Type": "application/json"
        },
        body: JSON.stringify(bookingRequest)
    })
    return response.ok ? response.json() : null
    }catch (err){
        console.log("Obokbar Tid")
        return null
    }
}

export async function del(id:number, ){
    const res = "/api/bookings/" + id
    const response = await fetch(res, {
        method: "DELETE"
    });
    return response.json();
    
}

