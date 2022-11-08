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
    constructor(minH: number,maxH: number,n: number,d:Date){
        this.minH = minH;
        this.maxH = maxH;
        this.n = n;
        this.d = d;
        this.times = new Array<Date>();
        // Timeslot time in milliseconds 
        const ts = ((maxH-minH)/n)*60*60*1000;
        let tempDate;
        for(let i = 0;i<n;i++){
            tempDate = new Date(d.getFullYear(),d.getMonth(),d.getDate(),minH)
            tempDate.setTime(tempDate.getTime()+i*ts)
            this.times[i] = tempDate
        }
    }
    // Returns corresponding date from specified timeslot from 0-9 
    getDate(tSlot: number ){
        return this.times[tSlot]
    }

    // Takes in a date and returns corresponding time-slot between 0-9
    // TODO currently broken if date is not aligned with defined slot
    // also bad code, can be streamlined
    getTSlot(date: Date){
        
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
    getArray(){
        return this.times
    }

}
