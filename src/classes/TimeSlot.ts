import { TimeSlotType } from "../../utils/types"

class TimeSlot {
    private startTime: Date
    private endTime: Date
    private timeSlot: TimeSlotType
    private dryingBooth: number


    constructor(timeSlot: TimeSlotType, dryingBooth: number, date: Date) {
        this.timeSlot = timeSlot
        this.startTime = new Date(date)
        this.startTime.setHours(parseInt(timeSlot.substring(0, 2)))
        this.startTime.setMinutes(parseInt(timeSlot.substring(3, 5)))
        this.startTime.setSeconds(0)
        this.endTime = new Date(date)
        this.endTime.setHours(parseInt(timeSlot.substring(6, 8)))
        this.endTime.setMinutes(parseInt(timeSlot.substring(9, 11)))
        this.endTime.setSeconds(0)

        this.dryingBooth = dryingBooth
    }

    getTimeSlot(): TimeSlot {
        return this
    }

    getStartTime(): Date {
        return this.startTime
    }

    getEndTime(): Date {
        return this.endTime
    }

    getDryingBooth(): number {
        return this.dryingBooth
    }

    toDate(date: Date): Date {
        const newDate = new Date(date)
        newDate.setHours(this.startTime.getHours())
        newDate.setMinutes(this.startTime.getMinutes())
        newDate.setSeconds(0)
        return newDate
    }

    hasPassed() {
        return new Date().getTime() > this.startTime.getTime()
    }

    toString(): string {
        return this.timeSlot
    }
}

export default TimeSlot;