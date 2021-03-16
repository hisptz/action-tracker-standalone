import PropTypes from 'prop-types';
import {
  Modal,
  ModalTitle,
  ModalContent,
  ModalActions,
  Button,
  ButtonStrip,
} from '@dhis2/ui';
import CustomForm from '../../Components/CustomForm';
import Metadata from '../../../resources/Json/FormsMetadata.json';
import './styles/ActionItemFormDialog.css'
import { getFormattedFormMetadata } from '../../../core/helpers/formsUtilsHelper';
import { useForm} from 'react-hook-form';
export function ActionStatusDialog({ onClose }) {
  const metadataFields = Metadata.actionStatusForm.fields;
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
      <ModalTitle>Add Action Status</ModalTitle>
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
ActionStatusDialog.propTypes = {
  onUpdate: PropTypes.func,
  onClose: PropTypes.func,
};

export default ActionStatusDialog;
