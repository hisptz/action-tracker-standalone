export function getJSDate(dateString = '') {
    if (dateString) {
        const [year, month, date] = dateString.split('-');
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(date))
    }
}
