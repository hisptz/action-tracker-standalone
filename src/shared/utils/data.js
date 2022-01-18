import {fromPairs} from "lodash";

function createPairs(headers, row) {
    return headers.map((header, index) => {
        return [
            header.name,
            row[index]
        ]
    });
}

export function sanitizedData(data) {
    const {headers, rows} = data ?? {};
    const sanitizedData = rows.map(row => {
        const pairs = createPairs(headers, row);
        return fromPairs(pairs);
    })
    console.log(sanitizedData);
    return sanitizedData;
}
