export function getJSDate(dateString = '') {
    if (dateString) {
        const [year, month, date] = dateString.split('-');
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(date))
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

