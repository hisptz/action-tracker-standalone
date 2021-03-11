import {flattenDeep, map } from 'lodash';
import {CustomFormField} from '../models/customFormField';
export const getFormattedFormMetadata = (dhisMetadataFields) => {
    return flattenDeep(
        map(dhisMetadataFields || [], (field) => {
          let validations = {};
          if ((field && field.name && field.mandatory) || field.compulsory) {
            validations = { ...validations, required: `${field.name} is required` };
          }
          return field && field.id
            ? new CustomFormField({ ...field, validations })
            : [];
        })
      );
}