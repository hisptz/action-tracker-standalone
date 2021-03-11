import PropTypes from 'prop-types';
import {
  Modal,
  ModalTitle,
  ModalContent,
  ModalActions,
  Button,
  ButtonStrip,
  Box,
} from '@dhis2/ui';
import ActionItemForm from './Components/ActionItemForm';
import CustomForm from '../CustomForm';
import { CustomFormField } from '../../../core/models/customFormField';
import Metadata from '../../../resources/Json/FormsMetadata.json';
import { map, flattenDeep } from 'lodash';
import './styles/ActionItemFormDialog.css'
export function ActionItemDialog({ onClose, onUpdate }) {
  const metadataFields = Metadata.actionItemForm.fields;
  const formFields = flattenDeep(
    map(metadataFields || [], (field) => {
      let validations = {};
      if ((field && field.name && field.mandatory) || field.compulsory) {
        validations = { ...validations, required: `${field.name} is required` };
      }
      return field && field.id
        ? new CustomFormField({ ...field, validations })
        : [];
    })
  );
  return (
    <Modal className="dialog-container" onClose={onClose} >
      <ModalTitle>Add Action Item</ModalTitle>
      <ModalContent>
        <CustomForm formFields={formFields} />
      </ModalContent>
      <ModalActions>
        {/* <ButtonStrip>
          <Button secondary onClick={onClose}>
            Hide
          </Button>
          <Button
            type="submit"
            primary
            onClick={() => {
              if (onUpdate) {
                //   onUpdate(selectedOrgUnit);
              } else {
                onClose();
              }
            }}
          >
            Update
          </Button>
        </ButtonStrip> */}
      </ModalActions>
    </Modal>
  );
}
ActionItemDialog.propTypes = {
  onUpdate: PropTypes.func,
  onClose: PropTypes.func,
};

export default ActionItemDialog;
