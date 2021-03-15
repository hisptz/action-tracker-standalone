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
import { getFormattedFormMetadata } from '../../../core/helpers/formsUtilsHelper';

function SolutionsDialog({ onClose, onUpdate }) {
  const metadataFields = Metadata.solutionsForm.fields;
  const formFields = getFormattedFormMetadata(metadataFields);
  return (
    <Modal className="dialog-container" onClose={onClose}>
      <ModalTitle>Possible Solution Form</ModalTitle>
      <ModalContent>
        <CustomForm formFields={formFields} onCloseModal={onClose} />
      </ModalContent>
    </Modal>
  );
}

export default SolutionsDialog;
