import { flattenDeep, map } from 'lodash';
import { CustomFormField } from '../models/customFormField';
export const getFormattedFormMetadata = (dhisMetadataFields) => {
  return flattenDeep(
    map(dhisMetadataFields || [], (field) => {
      let validations = {};
       validations = {...validations, ...getIsRequiredValidationFromField(field)}
      return field && field.id
        ? new CustomFormField({ ...field, validations })
        : [];
    })
  );
};

const getIsRequiredValidationFromField = (field) => {
  return field && field.name && (field.mandatory || field.compulsory)
    ? { required: `${field.name} is required` }
    : {};
};
