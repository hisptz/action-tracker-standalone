import * as _ from "lodash";


/*
* @param {String} dateString
* @returns: {Date} date
* */
export function getJSDate(dateString = '') {
    if (dateString) {
        if (typeof dateString === 'string') {
            if (dateString.match(/([\d]{4}-[\d]{2}-[\d]{2})/)) {
                const [year, month, date] = dateString.split('-');
                return new Date(parseInt(year), parseInt(month) - 1, parseInt(date))
            } else {
                throw Error('Invalid date String. Please provide a string with the format YYYY-MM-DD.')
            }
        } else {
            throw Error('Invalid parameter. The parameter should be of type string. A(n) ' + typeof dateString + ' was provided instead')
        }
    }
}

export function getDHIS2DateFromPeriodLibDate(dateString = '') {
    return getFormattedDateFromPeriod(dateString)
}

function getFormDate(date = new Date()) {
    return `${date.getFullYear()}-${_.padStart((date.getMonth() + 1), 2, '0')}-${_.padStart(date.getDate(), 2, '0')}`
}

export function getFormattedDateFromPeriod(dateString = '') {
    if (dateString) {
        if (typeof dateString === 'string') {
            if (dateString.match(/([\d]{2}-[\d]{2}-[\d]{4})/)) {
                const [date, month, year] = dateString.split('-');
                const dateObject = new Date(year, (month - 1), date);
                if (dateObject) {
                    return getFormDate(dateObject);
                }
            } else {
                throw Error('Invalid date String. Please provide a string with the format DD-MM-YYYY.')
            }
        } else {
            throw Error('Invalid parameter. The parameter should be of type string. A(n) ' + typeof dateString + ' was provided instead')
        }
    }
}

export function getFormattedDate(date) {
    let dateObject = new Date(date);
    if (isNaN(dateObject.getDate())) {
        dateObject = new Date();
    }
    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1;
    const year = dateObject.getFullYear();
    return (
        year +
        (month > 9 ? `-${month}` : `-0${month}`) +
        (day > 9 ? `-${day}` : `-0${day}`)
    );
}

export function getPeriodDates(quarter) {
    if (quarter) {
        if (typeof quarter === 'object') {
            const {startDate: startDateString, endDate: endDateString} = quarter;
            const [start, startMonth, startYear] = startDateString.split('-');
            const [end, endMonth, endYear] = endDateString.split('-');
            const startDate = new Date(startYear, startMonth - 1, start);
            const endDate = new Date(endYear, endMonth - 1, end);
            return {startDate, endDate}
        } else {
            throw Error('Invalid period provided.')
        }
    }
}

