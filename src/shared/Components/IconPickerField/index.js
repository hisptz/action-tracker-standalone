import { useState } from 'react';
import { Field, Input } from '@dhis2/ui';
import DHIS2Icon from '../DHIS2Icon';
import { useDhis2Icons } from '../../../core/hooks/dhis2Icon';
import { Dhis2IconState } from '../../../core/states';
import { useRecoilValue } from 'recoil';
import './styles/iconPickerField.css'

function InputPickerField({
  name,
  label,
  validationText,
  required,
  onChange,
  error,
  value,
}) {
  const [inputValue, setInputValue] = useState();
  const iconsRequest = useDhis2Icons();
  const dhis2Icons = useRecoilValue(Dhis2IconState);
  console.log({ dhis2Icons });

  return (
    <div
      className="icon-picker-field-container"
    >
      <div className="icon-picker-field">
        <Field
          name={name}
          required={required}
          label={label}
          validationText={validationText}
          error={error}
        >
          <Input name="input" onChange={onChange} />
        </Field>
      </div>
      <div
        className="icon-selector-container"
      ></div>
    </div>
  );
}

export default InputPickerField;
