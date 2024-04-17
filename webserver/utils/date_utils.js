const getDate = (dateString) => {
    const date = new Date(dateString)
    const DateStr = date.toLocaleDateString('en-GB', {
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit'
    });

    return DateStr
}

export default getDate;