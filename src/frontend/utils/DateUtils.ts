class DateUtils {
    static toLaundryBookingString(date: Date, timeSlot: string, dryingBooth?: number) {
        const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'} as const;
        let dateString = date.toLocaleDateString('sv-SE', options) + " " + timeSlot;

        if (dryingBooth) {
            dateString += ", Torkbås: " + dryingBooth;
        }

        return dateString;
    }

    //Old date is defined as 2 days before todays date
    static isOldDate(day: Date): boolean {
        const todaysDateMinus2Days = new Date(new Date().setDate(new Date().getDate() - 2));
        return todaysDateMinus2Days.getTime() > day.getTime();
    }
}

export default DateUtils;