import PropTypes from 'prop-types';
import {
  Modal,
  ModalTitle,
  ModalContent,
  ModalActions,
  Button,
  ButtonStrip,
} from '@dhis2/ui';
import { useAlert } from '@dhis2/app-runtime';
import { useForm } from 'react-hook-form';
import { ConfigState } from '../../../../core/states';
import { useRecoilValue } from 'recoil';
import { getFormattedFormMetadata } from '../../../../core/helpers/formsUtilsHelper';
import CustomForm from '../../../../shared/Components/CustomForm';
import { confirmModalClose } from '../../../../core/helpers/utils';


function ChallengeSettingsFormDialog({
  onClose,
  onUpdate,
  challengeSettings,
}) {
  const { challengeSettingsMetadata } = useRecoilValue(ConfigState);
  const { control, handleSubmit } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: challengeSettings?.getFormValues(),
  });
  const formFields = getFormattedFormMetadata(challengeSettingsMetadata);
  const { show } = useAlert(
    ({ message }) => message,
    ({ type }) => ({ duration: 3000, ...type })
  );
  // const [mutate, {loading: saving}] = useDataMutation(challengeSettings ? actionEditMutation : actionCreateMutation, {
  //     variables: {data: {}, id: action?.id},
  //     onComplete: (importSummary) => {
  //         onCompleteHandler(importSummary, show, {message: 'Action saved successfully', onClose, onUpdate})
  //     },
  //     onError: error => {
  //         onErrorHandler(error, show);
  //     }
  // })

  const onSubmit = (payload) => {
    console.log({ payload });
    // mutate({
    //     data: generatePayload(payload)
    // })
  };
 

  return (
    <Modal
      className="dialog-container"
      onClose={(_) => confirmModalClose(onClose)}
    >
      <ModalTitle>
        {challengeSettings ? 'Edit' : 'Add'} Challenge Settings
      </ModalTitle>
      <ModalContent>
        <CustomForm formFields={formFields} control={control} />
      </ModalContent>
      <ModalActions>
        <ButtonStrip end>
          <Button secondary onClick={(_) => confirmModalClose(onClose)}>
            Hide
          </Button>
          <Button type="submit" onClick={handleSubmit(onSubmit)} primary>
            Save Action Settings
          </Button>
        </ButtonStrip>
      </ModalActions>
    </Modal>
  );
}
ChallengeSettingsFormDialog.propTypes = {
  onUpdate: PropTypes.func,
  onClose: PropTypes.func,
};

export default ChallengeSettingsFormDialog;
