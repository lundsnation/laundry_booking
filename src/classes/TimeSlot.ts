class TimeSlot {
    readonly startTime: Date
    readonly endTime: Date
    readonly timeSlot: string
    readonly dryingBooth: number


    constructor(timeSlot: string, dryingBooth: number, date: Date) {
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

    hasPassed() {
        return new Date().getTime() > this.startTime.getTime()
    }

    toString(): string {
        return this.timeSlot
    }
}

export default TimeSlot;