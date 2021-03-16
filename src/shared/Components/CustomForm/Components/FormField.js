import PropTypes from 'prop-types';
import { CustomFormField } from '../../../../core/models/customFormField';
import { Controller } from 'react-hook-form';
import '../styles/FormField.css';
import { InputField, Checkbox, TextAreaField, SingleSelect } from '@dhis2/ui';
import { Dhis2ValueTypes } from '../../../../core/constants/constants';
import { map } from 'lodash';
function FormField({ field, control, errors }) {
  return (
    <>
      {field.id && field.formName && (
        <div className="input-field">
          <Controller
            name={field?.id}
            rules={{
              ...field?.validations,
            }}
            defaultValue=""
            control={control}
            render={({ onChange, value }) => {
              if (field && field.optionSet) {
                return (
                  <SingleSelect
                    className="select"
                    onChange={}
                    validationText={errors && errors[field?.id]?.message}
                    error={Boolean(errors && errors[field?.id])}
                  >
                    {map(field.optionSet.options || [], (option) => {
                      return (
                        <SingleSelectOption
                          label={option?.name}
                          value={option?.code}
                        />
                      );
                    })}
                  </SingleSelect>
                );
              }
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
                      required={
                        field?.validations && field.validations.required
                          ? true
                          : false
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
                      checked={value?.value}
                      required={
                        field?.validations && field.validations.required
                          ? true
                          : false
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
                      value={value?.value}
                      type={Dhis2ValueTypes[field?.valueType]?.formName}
                      required={
                        field?.validations && field.validations.required
                          ? true
                          : false
                      }
                      label={field?.formName}
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
