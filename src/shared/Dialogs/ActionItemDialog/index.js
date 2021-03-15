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
import CustomForm from '../../Components/CustomForm';
import { CustomFormField } from '../../../core/models/customFormField';
import Metadata from '../../../resources/Json/FormsMetadata.json';
import { map, flattenDeep } from 'lodash';
import './styles/ActionItemFormDialog.css'
import { getFormattedFormMetadata } from '../../../core/helpers/formsUtilsHelper';
export function ActionItemDialog({ onClose, onUpdate }) {
  const metadataFields = Metadata.actionItemForm.fields;
  const formFields = getFormattedFormMetadata(metadataFields);
  return (
    <Modal className="dialog-container" onClose={onClose} >
      <ModalTitle>Add Action Item</ModalTitle>
      <ModalContent>
        <CustomForm formFields={formFields} onCloseModal={onClose} />
      </ModalContent>
    </Modal>
  );
}
ActionItemDialog.propTypes = {
  onUpdate: PropTypes.func,
  onClose: PropTypes.func,
};

export default ActionItemDialog;
