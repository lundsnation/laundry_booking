import {conv} from "./conv"

const n = 10;
const maxH = 22;
const minH = 7;
export async function fetchTimes(d:Date): Promise<Array<boolean>>{
    const converter = new conv(minH,maxH,n,d);
    const bookedTimes = new Array<boolean>(10).fill(false);
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
                bookedTimes[timeSlot] = true;
            }
        }
    }
    return bookedTimes

}
