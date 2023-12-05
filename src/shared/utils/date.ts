import { DateTime } from 'luxon'

export function formatDate (dateString: string): string {
    return DateTime.fromJSDate(new Date(dateString)).toFormat('dd MMMM yyyy')
}
