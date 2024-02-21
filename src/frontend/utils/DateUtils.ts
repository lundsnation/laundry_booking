class DateUtils {
    static toLaundryBookingString(date: Date, timeSlot: string, dryingBooth?: number) {
        // Adjust options to include only day and month
        const options = {month: 'long', day: 'numeric'} as const;
        // Generate the date string without the weekday and year, and in the desired locale format
        let dateString = date.toLocaleDateString('sv-SE', options);

        // Append the time slot directly after the date, followed by a comma if dryingBooth is specified
        dateString += `, ${timeSlot}`;

        // Append drying booth information if provided
        if (dryingBooth) {
            dateString += `, Torkbås: ${dryingBooth}`;
        }

        return dateString;
    }


    //Old date is defined as 2 days before today's date
    static isOldDate(day: Date): boolean {
        const todaysDateMinus2Days = new Date(new Date().setDate(new Date().getDate() - 2));
        return todaysDateMinus2Days.getTime() > day.getTime();
    }
}

export default DateUtils;