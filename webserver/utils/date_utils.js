const getDate = (dateString) => {
    const date = new Date(dateString)
    const DateStr = date.toLocaleDateString('en-GB', {
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit'
    });

    return DateStr
}

export const getDaysAgo = (dateString) => {
    const inputDate = new Date(dateString);
    const currentDate = new Date();

    // Remove time parts for an accurate day difference
    const dateOnly = new Date(inputDate.setHours(0, 0, 0, 0));
    const currentDateOnly = new Date(currentDate.setHours(0, 0, 0, 0));

    // Time difference in milliseconds
    const timeDiff = currentDateOnly - dateOnly;
    
    // Convert time difference to days
    const days = timeDiff / (1000 * 3600 * 24);

    const daysnum = Math.round(Math.abs(days))
    const weeknum = Math.round(Math.abs(days) / 7)
    const monthnum = Math.round(Math.abs(days) / 30)
    const yearnum = Math.round(Math.abs(days) / 365)

    // Convert days to weeks, months, or years if applicable
    if (Math.abs(days) <= 7) {
        if (daysnum === 0) return "today"
        if (daysnum === 1) return "yesterday"
        return `${daysnum} days ago`;
    }
    
    if (Math.abs(days) < 30) {
        if (weeknum === 0) return "last week"
        return `${weeknum} weeks ago`;
    }
    
    if (Math.abs(days) < 365) {
        if (monthnum === 0) return "last month"
        return `${monthnum} months ago`;
    }

    if (yearnum === 0) return "last year"
    return `${yearnum} years ago`;

};
export default getDate;