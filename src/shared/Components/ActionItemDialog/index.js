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
export function ActionItemDialog({ onClose, onUpdate }) {
  const metadataFields = Metadata.actionItemForm.fields;
  const formFields = flattenDeep(
    map(metadataFields || [], (field) => {
      return field ? new CustomFormField(field) : [];
    })
  );
  return (
    <Modal onClose={onClose}>
      <ModalTitle>Add Action Item</ModalTitle>
      <ModalContent>
        <CustomForm formFields={formFields} />
      </ModalContent>
      <ModalActions>
        <ButtonStrip>
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
        </ButtonStrip>
      </ModalActions>
    </Modal>
  );
}
ActionItemDialog.propTypes = {
  onUpdate: PropTypes.func,
  onClose: PropTypes.func,
};

export default ActionItemDialog;
