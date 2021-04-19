import { useState } from 'react';
import PropTypes from 'prop-types';
import { CustomFormField } from '../../../../core/models/customFormField';
import { Controller, useFormState, useWatch } from 'react-hook-form';
import '../styles/FormField.css';
import {
  InputField,
  Checkbox,
  TextAreaField,
  SingleSelectField,
  SingleSelectOption,
} from '@dhis2/ui';
import { Dhis2ValueTypes } from '../../../../core/constants';
import { map } from 'lodash';
import { SketchPicker } from 'react-color';

function FormField({ field, control }) {
  const [selectedColor, setSelectedColor] = useState('#000');
  const dependants = useWatch({ control, name: field.dependants }); //watchFields is an array of fieldIds that are used to validate other fields in the form
  const { errors } = useFormState({ control });
 const handleChangeComplete = (color) => {
    setSelectedColor(color.hex);
  };

  return (
    <>
      {field.id && field.formName && (
        <div className="input-field">
          <Controller
            name={field?.id}
            rules={{
              ...field?.validations,
              validate: (value) => {
                if (!/[\S]/.test(value.value)) {
                  return field.validations.required;
                }
                if (_.has(field?.validations, 'customValidate')) {
                  return field?.validations?.customValidate(value, dependants, control);
                } else if (_.has(field?.validations, 'validate')) {
                  return field?.validations?.validate(value);
                }
              },
            }}
            control={control}
            render={({ field: { onChange, value } }) => {
              if (field && field.optionSet) {
                if (field && field.optionSet) {
                  return (
                    <SingleSelectField
                      className="select"
                      filterable
                      clearable
                      dataTest="dhis2-uiwidgets-singleselectfield"
                      required={
                        field?.validations && field.validations.required
                      }
                      label={field?.formName}
                      noMatchText="No option available"
                      validationText={errors && errors[field?.id]?.message}
                      error={Boolean(errors && errors[field?.id])}
                      onChange={(e) => {
                        onChange({
                          ...value,
                          value: e.selected,
                          name: field?.id,
                        });
                      }}
                      selected={value?.value}
                    >
                      {map(field.optionSet.options || [], (option) => {
                        return (
                          <SingleSelectOption
                            label={option?.name}
                            value={option?.code}
                            key={option?.code}
                          />
                        );
                      })}
                    </SingleSelectField>
                  );
                }
              }
              switch (field?.valueType) {
                case Dhis2ValueTypes.NUMBER.name:
                case Dhis2ValueTypes.INTEGER.name:
                case Dhis2ValueTypes.TEXT.name:
                case Dhis2ValueTypes.DATE.name:
                  return (
                    <InputField
                      min={field?.min}
                      max={field?.max}
                      name={field?.id}
                      dataTest="dhis2-uiwidgets-inputfield"
                      onChange={onChange}
                      onFocus={(value, event) => {
                        // event.currentTarget.click();// Only works for firefox
                        //TODO: get solutions for Chrome and edge
                        event.currentTarget.dispatchEvent(new Event('click'));
                      }}
                      value={value?.value}
                      required={
                        field?.validations &&
                        Boolean(field.validations.required)
                      }
                      type={Dhis2ValueTypes[field?.valueType]?.formName}
                      label={field?.formName}
                      error={Boolean(errors && errors[field?.id])}
                      validationText={errors && errors[field?.id]?.message}
                    />
                  );
                case Dhis2ValueTypes.TRUE_ONLY.name:
                  return (
                    <Checkbox
                      name={field?.id}
                      onChange={(e) => onChange({ ...value, value: e.checked })}
                      dataTest="dhis2-uiwidgets-checkboxfield"
                      checked={value?.value}
                      required={
                        field?.validations &&
                        Boolean(field.validations.required)
                      }
                      label={field?.formName}
                      error={Boolean(errors && errors[field?.id])}
                      validationText={errors && errors[field?.id]?.message}
                    />
                  );
                case Dhis2ValueTypes.LONG_TEXT.name:
                  return (
                    <TextAreaField
                      name={field?.id}
                      onChange={onChange}
                      dataTest="dhis2-uiwidgets-textareafield"
                      value={value?.value}
                      type={Dhis2ValueTypes[field?.valueType]?.formName}
                      required={
                        field?.validations && field.validations.required
                      }
                      label={field?.formName}
                      error={Boolean(errors && errors[field?.id])}
                      validationText={errors && errors[field?.id]?.message}
                    />
                  );
                case Dhis2ValueTypes.COLOR_PICKER.name:
                  return (
                    <SketchPicker
                      color={selectedColor}
                      onChangeComplete={handleChangeComplete}
                    />
                  );
                default:
                  return <p />;
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
  control: PropTypes.any.isRequired,
};

export default FormField;
