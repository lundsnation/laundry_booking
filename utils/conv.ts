// Conversion class for passing Dates and timeSlots in Frontend. Each timeslot corresponds to an index of the booked time, 
// it is signified by the start time of the slot 
// This object also contains an array of dates used for sending requests for to DB. Only one instance of the class is required for the day, given 
// that the setDate method is called, updating the corresponding time-slot dates. 
// Starttime, endtime and number of timeslots are arbitrary parameters. 

export class conv{
    // Maximum hour for booking
    minH:number
    // Minimum hour for booking
    maxH:number
    // Number of timeslots
    n:number
    // Spec. date
    d:Date
    // Array
    times:Array<Date>
    // Length of timeslots
    ts:number
    constructor(minH: number,maxH: number,n: number,d:Date){
        this.minH = minH;
        this.maxH = maxH;
        this.n = n;
        this.d = d;
        this.times = new Array<Date>();
        // Timeslot time in milliseconds 
        this.ts = ((maxH-minH)/n)*60*60*1000;
        let tempDate;
        // Assigning times for each slot based on given date d
        for(let i = 0;i<n;i++){
            tempDate = new Date(d.getFullYear(),d.getMonth(),d.getDate(),minH)
            tempDate.setTime(tempDate.getTime()+i*this.ts)
            this.times[i] = tempDate
        }
    }
    // Sets new date and updates timeslots accordingly, can be used 
    setDate(d: Date){
        this.d = d
        let tempDate;
        for(let i = 0;i<this.n;i++){
            tempDate = new Date(d.getFullYear(),d.getMonth(),d.getDate(),this.minH)
            tempDate.setTime(tempDate.getTime()+i*this.ts)
            this.times[i] = tempDate
        }
    }
    // Returns corresponding date from specified timeslot from 0-9 
    getDate(tSlot: number ) : Date{
        return this.times[tSlot]
    }

    // Takes in a date and returns corresponding time-slot between 0 and n
    // TODO: inefficient code, can be streamlined
    getTSlot(date: Date) : number{
        let tempArray = new Array<number>(10)
        for(let i = 0;i<tempArray.length;i++){
            tempArray[i] = this.times[i].getTime()
        }
        for(let i = 0;i<tempArray.length;i++){   
            if(tempArray[i] == date.getTime()){              
                return i
            }
        }
        return -1
    }   
    getArray() : Array<Date>{
        return this.times
    }
    getspecDate(): Date{
        return this.d
    }

}
