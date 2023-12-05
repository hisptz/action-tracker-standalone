import { DateTime } from 'luxon'

export function formatDate (dateString: string): string {
    return DateTime.fromJSDate(new Date(dateString)).toFormat('dd MMMM yyyy')
}

export function getEarlierDate (dates: string[]) {
    const dateTimes = dates.map(date => DateTime.fromJSDate(new Date(date)))
    return dateTimes.reduce((min, current) => {
        return min < current ? min : current
    })
}

export function getLaterDate (dates: string[]) {
    const dateTimes = dates.map(date => DateTime.fromJSDate(new Date(date)))
    return dateTimes.reduce((max, current) => {
        return max > current ? max : current
    })
}
