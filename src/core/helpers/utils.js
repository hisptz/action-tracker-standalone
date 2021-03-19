export function uid() {
    const letters = 'abcdefghijklmnopqrstuvwxyz' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const allowedChars = '0123456789' + letters;
    const NUMBER_OF_CODEPOINTS = allowedChars.length;
    const CODESIZE = 11;
    let uid;
    uid = letters.charAt(Math.random() * letters.length);
    for (let i = 1; i < CODESIZE; ++i) {
        uid += allowedChars.charAt(Math.random() * NUMBER_OF_CODEPOINTS);
    }
    return uid;
}

export const confirmModalClose = (onClose) => {
    const confirmation = window.confirm('Are you sure you want to quit? All changes will be lost.');
    if (confirmation) {
        onClose();
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
