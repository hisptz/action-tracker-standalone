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


export function generateTextColor(backgroundColor) {
    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }

    // function rgbToHex(r, g, b) {
    //     return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    // }
    const {r, g, b} = hexToRgb(backgroundColor);


    function colorIsLight(r, g, b){
        var a = 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return (a < 0.5);
    }
    return colorIsLight(r,g,b) ? '#000': '#fff'
}

