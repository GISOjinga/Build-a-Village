export function toHMS(s: number): string {
    function pad(n: number): string {
        return n < 10 ? `0${n}` : `${n}`;
    }

    const hours = math.floor(s / 3600);
    const minutes = math.floor((s % 3600) / 60);
    const seconds = s % 60;

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}


export function secondsSince6pmCT() {
    //Define the specific time: January 1st, 6 PM CT
    const year = os.date("*t").year// Get the current year
    const month = 1  // January
    const day = 1  // 1st of January

    //Determine if Daylight Saving Time(DST) is in effect on January 1st
    const isDST = os.date("*t", os.time({ year: year, month: month, day: day, hour: 18, min: 0, sec: 0 })).isdst

    //Adjust for Central Time(CT)
    const offset = isDST && - 5 || - 6

    //Create the date table for January 1st, 6 PM CT
    const januaryFirst6PM = os.time({
        year: year,
        month: month,
        day: day,
        hour: 18 + offset,
        min: 0,
        sec: 0
    })

    //Get the current time
    const currentTime = os.time()

    //Calculate the number of seconds since January 1st, 6 PM CT
    const offseting = -3600


    return (currentTime - januaryFirst6PM) + offseting
}