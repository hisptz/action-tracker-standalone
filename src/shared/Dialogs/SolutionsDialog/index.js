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
import Metadata from '../../../resources/Json/FormsMetadata.json';
import { getFormattedFormMetadata } from '../../../core/helpers/formsUtilsHelper';
import { useForm} from 'react-hook-form';

function SolutionsDialog({ onClose }) {
  const metadataFields = Metadata.solutionsForm.fields;
  const formFields = getFormattedFormMetadata(metadataFields);
  const onSubmit = (payload) => {
    console.log({ payload });
    onClose();
  };
  const { control, errors, handleSubmit } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });
  return (
    <Modal className="dialog-container" onClose={onClose}>
      <ModalTitle>Possible Solution Form</ModalTitle>
      <ModalContent>
        <CustomForm formFields={formFields} control={control} errors={errors} />
      </ModalContent>
      <ModalActions>
        <ButtonStrip end>
          <Button secondary onClick={onClose}>
            Hide
          </Button>
          <Button type="submit" onClick={handleSubmit(onSubmit)} primary>
            Update
          </Button>
        </ButtonStrip>
      </ModalActions>
    </Modal>
  );
}

export default SolutionsDialog;
