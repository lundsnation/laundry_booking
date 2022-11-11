import {conv} from "./conv"
import {Booking} from "../utils/types"

const n = 10;
const maxH = 22;
const minH = 7;
export async function fetchTimes(converter:conv): Promise<Array<Booking>>{

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
