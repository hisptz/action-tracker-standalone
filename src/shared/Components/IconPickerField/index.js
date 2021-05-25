import {useState} from 'react';
import {Field, Input} from '@dhis2/ui';
import IconsSelectorDialog from '../../Dialogs/IconsSelectorDialog';
import './styles/iconPickerField.css';
import {isEmpty} from 'lodash';
import DHIS2Icon from '../DHIS2Icon';

function InputPickerField({
                              name,
                              label,
                              validationText,
                              required,
                              onChange,
                              error,
                              value,
                              ...props
                          }) {
    const [openIconSelectorDialog, setOpenIconSelectorDialog] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState({key: value});

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
                        {...props}
                        name={name}
                        id={name}
                        onChange={onChange}
                        disabled
                        value={selectedIcon?.key}
                        onFocus={() => setOpenIconSelectorDialog(!openIconSelectorDialog)}
                    />
                </Field>
            </div>
            <div
                onClick={() => setOpenIconSelectorDialog(!openIconSelectorDialog)}
                className="icon-selector-container"
            />
            {isEmpty(selectedIcon) && (
                <div
                    onClick={() => setOpenIconSelectorDialog(!openIconSelectorDialog)}
                    className="icon-selector-container bg-black"
                />
            )}
            {!isEmpty(selectedIcon) && (
                <div
                    onClick={() => setOpenIconSelectorDialog(!openIconSelectorDialog)}
                    className="icon-selector-container"
                >
                    <DHIS2Icon iconName={selectedIcon?.key} size={40}/>
                </div>
            )}
            {openIconSelectorDialog && (
                <IconsSelectorDialog
                    onClose={() => onClose()}
                    onUpdate={onUpdateIconsSelection}
                    initialSelectedIcon={selectedIcon}
                />
            )}
        </div>
    );
}

export default InputPickerField;
