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
      <div style={{ width: '90%' }}>
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
        style={{
          position: 'absolute',
          bottom: '0',
          right: '0',
          width: '10%',
          height: '40px',
          border: '1px solid black',
          backgroundColor: 'black',
        }}
      ></div>
    </div>
  );
}

export default InputPickerField;
