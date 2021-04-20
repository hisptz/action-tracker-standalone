import { useState } from 'react';
import { Field, Input } from '@dhis2/ui';
import IconsSelectorDialog from '../../Dialogs/IconsSelectorDialog';
import './styles/iconPickerField.css';

function InputPickerField({
  name,
  label,
  validationText,
  required,
  onChange,
  error,
  value,
}) {
  const [openIconSelectorDialog, setOpenIconSelectorDialog] = useState(false);
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="icon-picker-field-container">
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
        onClick={() => setOpenIconSelectorDialog(!openIconSelectorDialog)}
        className="icon-selector-container"
      ></div>
      {openIconSelectorDialog && (
        <IconsSelectorDialog onClose={() => setOpenIconSelectorDialog(false)} />
      )}
    </div>
  );
}

export default InputPickerField;
