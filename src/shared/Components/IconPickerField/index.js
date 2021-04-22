import { useState } from 'react';
import { Field, Input } from '@dhis2/ui';
import IconsSelectorDialog from '../../Dialogs/IconsSelectorDialog';
import './styles/iconPickerField.css';
import { isEmpty } from 'lodash';
import DHIS2Icon from '../DHIS2Icon';
import  useDHIS2Icon from '../../Components/DHIS2Icon/hooks/icon'

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
  const {loading, icon} = useDHIS2Icon(value);
  const [selectedIcon, setSelectedIcon] = useState(icon);

  function onUpdateIconsSelection(icon) {
    setSelectedIcon(icon);
    setOpenIconSelectorDialog(false);
    onChange(icon?.key)

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
          <DHIS2Icon iconName={selectedIcon?.key} size={40} />
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
