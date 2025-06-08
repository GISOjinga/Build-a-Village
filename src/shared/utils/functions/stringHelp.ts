export function addCommasEveryThreeDigits(number: number = 0): string {
    let numStr = tostring(number); // Convert number to string
    let length = numStr.size(); // Get the length of the string

    // Insert commas at appropriate positions
    for (let i = length - 3; i > 0; i -= 3) {
        numStr = string.sub(numStr, 1, i) + "," + string.sub(numStr, i + 1);
    }

    // Return the formatted number
    return numStr;
}




export function secondsToMinutesSecondsMilliseconds(seconds: number): string {
    const totalMilliseconds = seconds * 1000;
    const minutes = math.floor(totalMilliseconds / (60 * 1000));
    const remainingSeconds = math.floor((totalMilliseconds % (60 * 1000)) / 1000);
    const milliseconds = math.floor(totalMilliseconds % 1000);

    // Pad single-digit seconds and milliseconds with leading zeros
    const paddedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
    const paddedMilliseconds = milliseconds < 10 ? '00' + milliseconds : milliseconds < 100 ? '0' + milliseconds : milliseconds;

    return `${minutes}:${paddedSeconds}.${paddedMilliseconds}`;
}