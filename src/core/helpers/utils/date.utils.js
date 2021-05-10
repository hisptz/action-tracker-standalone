import _ from "lodash";

export function getJSDate(dateString = '') {
    if (dateString) {
        const [year, month, date] = dateString.split('-');
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(date))
    }
}

export function getDHIS2DateFromPeriodLibDate(dateString = '') {
    if (!_.isEmpty(dateString)) {
        const [date, month, year] = dateString.split('-');
        return [year, month, date].join('-')
    }
}

export function validDate(date) {
    let dateStr = '';
    const dateArr = split(date, '-').reverse();
    if (dateArr && dateArr.length) {
        for (
            let dateItemIndex = 0;
            dateItemIndex < dateArr.length;
            dateItemIndex++
        ) {
            dateStr =
                dateItemIndex === (dateArr.length - 1)
                    ? `${dateStr}${dateArr[dateItemIndex]}`
                    : `${dateStr}${dateArr[dateItemIndex]}-`;
        }
    }
    return dateStr;
}

function getFormDate(date = new Date()) {
    return `${date.getFullYear()}-${_.padStart((date.getMonth() + 1), 2, '0')}-${_.padStart(date.getDate(), 2, '0')}`
}

export function getFormattedDateFromPeriod(dateString = '') {
    const [date, month, year] = dateString.split('-');
    const dateObject = new Date(year, (month - 1), date);
    if (dateObject) {
        return getFormDate(dateObject);
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
