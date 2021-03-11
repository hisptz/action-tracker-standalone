import React from 'react';
import PropTypes from 'prop-types';
import { CustomFormField } from '../../../../core/models/customFormField';
import TextField from '@material-ui/core/TextField';
import { Field, Form } from 'react-final-form';
import { Controller } from 'react-hook-form';
import '../styles/FormField.css';
import { InputField, Checkbox, TextArea } from '@dhis2/ui';
import { Dhis2ValueTypes } from '../../../../core/constants/constants';
function FormField({ field, control, errors }) {
  return (
    <>
      {field.id && field.name && (
        <div className="input-field">
          <Controller
            name={field?.id}
            rules={{
              ...field?.validations,
            }}
            defaultValue=""
            control={control}
            render={({ onChange, value }) => {
              switch (field?.valueType) {
                case Dhis2ValueTypes.NUMBER.name:
                case Dhis2ValueTypes.INTEGER.name:
                case Dhis2ValueTypes.TEXT.name:
                case Dhis2ValueTypes.DATE.name:
                  return (
                    <InputField
                      name={field?.id}
                      onChange={onChange}
                      value={value?.value}
                      type={Dhis2ValueTypes[field?.valueType]?.formName}
                      label={field?.name}
                      error={Boolean(errors && errors[field?.id])}
                      validationText={errors && errors[field?.id]?.message}
                    />
                  );
                case Dhis2ValueTypes.TRUE_ONLY.name:
                  return (
                    <Checkbox
                      name={field?.id}
                      onChange={(e) => onChange({ ...value, value: e.checked })}
                      checked={value?.value}
                      label={field?.name}
                      error={Boolean(errors && errors[field?.id])}
                      validationText={errors && errors[field?.id]?.message}
                    />
                  );
                case Dhis2ValueTypes.LONG_TEXT.name:
                  return (
                    <TextArea
                      name={field?.id}
                      onChange={onChange}
                      value={value?.value}
                      type={Dhis2ValueTypes[field?.valueType]?.formName}
                      label={field?.name}
                      error={Boolean(errors && errors[field?.id])}
                      validationText={errors && errors[field?.id]?.message}
                    />
                  );
                default:
                  return <p></p>;
              }
            }}
          />
        </div>
      )}
    </>
  );
}
FormField.propTypes = {
  field: PropTypes.instanceOf(CustomFormField).isRequired,
};

export default FormField;
