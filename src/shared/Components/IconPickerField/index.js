import { useState } from 'react';
import { Field, Input } from '@dhis2/ui';
import IconsSelectorDialog from '../../Dialogs/IconsSelectorDialog';
import './styles/iconPickerField.css';
import { isEmpty } from 'lodash';
import DHIS2Icon from '../DHIS2Icon';

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
  const [selectedIcon, setSelectedIcon] = useState(null);

  function onUpdateIconsSelection(icon) {
    setSelectedIcon(icon);
    setOpenIconSelectorDialog(false);
    console.log(selectedIcon);
  }
  function onClose() {
    setOpenIconSelectorDialog(false);
  }

  return (
    <div className="icon-picker-field-container">
      <div
        className="icon-picker-field"
        onClick={() => setOpenIconSelectorDialog(!openIconSelectorDialog)}
      >
        <Field
          name={name}
          required={required}
          label={label}
          validationText={validationText}
          error={error}
          value={selectedIcon?.key}
        >
          <Input
            disabled={true}
            name="input"
            onChange={onChange}
            value={selectedIcon?.key}
          />
        </Field>
      </div>
      <div
        onClick={() => setOpenIconSelectorDialog(!openIconSelectorDialog)}
        className="icon-selector-container"
      ></div>
      {isEmpty(selectedIcon) && (
        <div
          onClick={() => setOpenIconSelectorDialog(!openIconSelectorDialog)}
          className="icon-selector-container bg-black"
        ></div>
      )}
      {!isEmpty(selectedIcon) && (
        <div
          onClick={() => setOpenIconSelectorDialog(!openIconSelectorDialog)}
          className="icon-selector-container"
        >
          <DHIS2Icon iconName={selectedIcon?.key} size={50} />
        </div>
      )}
      {openIconSelectorDialog && (
        <IconsSelectorDialog
          onClose={() => onClose()}
          onUpdate={onUpdateIconsSelection}
        />
      )}
    </div>
  );
}

export default InputPickerField;
