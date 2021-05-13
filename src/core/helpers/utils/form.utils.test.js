import {getFormattedFormMetadata} from './form.utils'
import {CustomFormField} from "../../models/customFormField";


describe("Test getFormattedFormMetadata", ()=>{
    it('should return an empty array if no argument is provided', ()=>{
        expect(getFormattedFormMetadata()).toEqual([])
    })
    it('should return an array with valid objects', ()=>{
        const formattedMetadata = getFormattedFormMetadata();
        expect(Array.isArray(formattedMetadata)).toBe(true);
        // expect(formattedMetadata[0]).toBeInstanceOf(CustomFormField)
    })
})
