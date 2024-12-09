export default function FormatDate(created_at) {
    // Parse the created_at string to a Date object
    const date = new Date(created_at);

    // Month abbreviation
    const monthAbbreviations = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthAbbreviations[date.getMonth()];

    // Day of the month
    const day = date.getDate();

    // Year
    const year = date.getFullYear();

    // Hour (in 12-hour format)
    let hour = date.getHours();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12; // Convert 0 to 12
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Ensure double-digit minutes

    // Timezone abbreviation
    const timezoneAbbr = '(ET)'; // You can change this to your desired timezone abbreviation

    // Construct the formatted date string
    const formattedDate = `${month} ${day}, ${year}, ${hour}:${minutes} ${ampm} ${timezoneAbbr}`;

    return formattedDate;
}


