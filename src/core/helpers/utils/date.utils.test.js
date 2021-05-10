import {
    getJSDate,
    getFormattedDate,
    getFormattedDateFromPeriod,
    getDHIS2DateFromPeriodLibDate,
} from "./date.utils";

describe('Test getJSDate', () => {

    it('Returns a JS date', () => {
        const date = getJSDate('2021-05-10');
        expect(date.getDate()).toBeDefined()
    })
    it('Returns undefined if no argument is given', () => {
        const date = getJSDate();
        expect(date).toBeUndefined()
    })
    it('Should throw an error when an invalid string is given', () => {
        expect(() => getJSDate('23-12-2021')).toThrow(Error('Invalid date String. Please provide a string with the format YYYY-MM-DD.'))
    })

    it('Should throw an error when the argument provided is not a string', () => {

        expect(() => getJSDate(12042021)).toThrow(Error('Invalid parameter. The parameter should be of type string. A(n) number was provided instead'))
    })


})
describe('Test getFormattedDate', () => {
    it('should return a valid date string', () => {
        const dateString = getFormattedDate(new Date());
        expect(typeof dateString).toBe('string')
        expect(dateString).toMatch(/([\d]{4}-[\d]{2}-[\d]{2})/)
    })
})
describe('Test getFormattedDateFromPeriod', () => {
    it('should return a valid dateString', () => {
        const dateString = getFormattedDateFromPeriod('01-12-2021');
        expect(typeof dateString).toBe('string')
        expect(dateString).toMatch(/([\d]{4}-[\d]{2}-[\d]{2})/)
    })
    it('should throw an error on an invalid parameter', () => {
        expect(() => getFormattedDateFromPeriod('2021-12-01')).toThrow(Error('Invalid date String. Please provide a string with the format DD-MM-YYYY.'))
    })
})
describe('Test getDHIS2DateFromPeriodLibDate', () => {
    it('should return a valid dateString', () => {
        const dateString = getDHIS2DateFromPeriodLibDate('01-12-2021');
        expect(typeof dateString).toBe('string')
        expect(dateString).toMatch(/([\d]{4}-[\d]{2}-[\d]{2})/)
    })
    it('should throw an error on an invalid parameter', () => {
        expect(() => getDHIS2DateFromPeriodLibDate('2021-12-01')).toThrow(Error('Invalid date String. Please provide a string with the format DD-MM-YYYY.'))
    })
})
