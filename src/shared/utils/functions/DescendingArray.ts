export default function DescendingArray(str: string): string[] {
    // Initialize an empty array to store subs
    const autoCompleteArray: string[] = [];

    // Generate subs
    let word = "";
    for (let i = 0; i < str.size(); i++) {
        const char = str.sub(i, i + 1);
        if (char === char.upper() && i > 0 && str.sub(i - 1, i) === str.sub(i - 1, i).lower()) {
            // Add previous word before starting a new one
            autoCompleteArray.push(word.lower());
            autoCompleteArray.push(word.upper());
            word = "";
        }
        word += char;
        // Add each word to the array
        autoCompleteArray.push(word.lower());
        autoCompleteArray.push(word.upper());
    }

    // Return the array of subs
    return autoCompleteArray;
}
