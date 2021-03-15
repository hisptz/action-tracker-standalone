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
import { useForm, Controller } from 'react-hook-form';
export function ActionItemDialog({ onClose }) {
  const metadataFields = Metadata.actionItemForm.fields;
  const { control, errors, handleSubmit } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });
  const formFields = getFormattedFormMetadata(metadataFields);
   const onSubmit = (payload) => {
      console.log({payload});
      onClose();
   }
  return (
    <Modal className="dialog-container" onClose={onClose} >
      <ModalTitle>Add Action Item</ModalTitle>
      <ModalContent>
        <CustomForm formFields={formFields} control={control} errors={errors} />
      </ModalContent>
      <ModalActions>
      <ButtonStrip end>
       <Button secondary onClick={onClose}>Hide</Button>
        <Button type="submit" onClick={handleSubmit(onSubmit)} primary>
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
