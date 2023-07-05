import { TimeSlotType } from '../../utils/types'
import TimeSlot from './TimeSlot'

class TimeSlots {
    static TIME_SLOTS: TimeSlotType[] = [
        "07:00-08:30",
        "08:30-10:00",
        "10:00-11:30",
        "11:30-13:00",
        "13:00-14:30",
        "14:30-16:00",
        "16:00-17:30",
        "17:30-19:00",
        "19:00-20:30",
        "20:30-22:00"
    ];

    static TIME_SLOT_TO_DRYING_BOOTH: Map<TimeSlotType, number> = new Map([
        ["07:00-08:30", 1],
        ["08:30-10:00", 2],
        ["10:00-11:30", 3],
        ["11:30-13:00", 4],
        ["13:00-14:30", 5],
        ["14:30-16:00", 6],
        ["16:00-17:30", 7],
        ["17:30-19:00", 8],
        ["19:00-20:30", 9],
        ["20:30-22:00", 10]
    ]);

    //Factory method
    static getLength(): number {
        return this.TIME_SLOTS.length
    }

    static getTimeSlots = (date: Date): TimeSlot[] => {
        const timeSlots: TimeSlot[] = []
        TimeSlots.TIME_SLOTS.forEach(timeSlot => {
            timeSlots.push(new TimeSlot(timeSlot, this.TIME_SLOT_TO_DRYING_BOOTH.get(timeSlot) as number, date))
        })
        return timeSlots
    }
}

export default TimeSlots;


