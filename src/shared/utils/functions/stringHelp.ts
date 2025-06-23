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

// Converts a number of seconds into "HH:MM:SS" format
export function formatToMMSS(totalSeconds: number) {
    // Ensure it's a number and not negative
    totalSeconds = math.max(0, totalSeconds || 0)

    const hours = math.floor(totalSeconds / 3600)
    const minutes = math.floor((totalSeconds % 3600) / 60)
    const seconds = math.floor(totalSeconds % 60)

    // Format with leading zeros
    return string.format("%02d:%02d", minutes, seconds)
}

// Converts a number of seconds into "HH:MM:SS" format
export function formatToHHMMSS(totalSeconds: number) {
    // Ensure it's a number and not negative
    totalSeconds = math.max(0, totalSeconds || 0)

    const hours = math.floor(totalSeconds / 3600)
    const minutes = math.floor((totalSeconds % 3600) / 60)
    const seconds = math.floor(totalSeconds % 60)

    // Format with leading zeros
    return string.format("%02d:%02d:%02d", hours, minutes, seconds)
}

// Converts a number of seconds into "DD:HH:MM:SS" format
export function formatToDDHHMMSS(totalSeconds: number) {
    totalSeconds = math.max(0, totalSeconds || 0);

    const days = math.floor(totalSeconds / 86400);
    const hours = math.floor((totalSeconds % 86400) / 3600);
    const minutes = math.floor((totalSeconds % 3600) / 60);
    const seconds = math.floor(totalSeconds % 60);

    return string.format("%02d:%02d:%02d:%02d", days, hours, minutes, seconds);
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