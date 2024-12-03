export const get_formatted_date = (datestr: string) => {
    const date = new Date(datestr);
    const formatted = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit', 
    year: '2-digit'
    }).replace(/\//g, '/');
    return formatted
}