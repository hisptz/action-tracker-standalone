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
import {getFormattedFormMetadata} from '../../../core/helpers/formsUtilsHelper';
import {useForm} from 'react-hook-form';
import ActionStatus from "../../../core/models/actionStatus";
import {useRecoilValue} from "recoil";
import {ConfigState, DimensionsState} from "../../../core/states";
import {useAlert, useDataMutation} from "@dhis2/app-runtime";

const actionStatusMutation = {
    type: 'create',
    resource: 'events',
    data: ({data}) => data
}

export function ActionStatusDialog({onClose, action, onUpdate}) {
    const {orgUnit} = useRecoilValue(DimensionsState);
    const {actionProgramMetadata} = useRecoilValue(ConfigState);
    const metadataFields = ActionStatus.getFormFields(actionProgramMetadata);
    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}))
    const onSubmit = (payload) => {
        mutate({
            data: generatePayload(payload)
        })
    };
    const {control, errors, handleSubmit} = useForm({
        mode: 'onBlur',
        reValidateMode: 'onBlur',
    });
    const formFields = getFormattedFormMetadata(metadataFields);
    const [mutate, {loading: saving}] = useDataMutation(actionStatusMutation, {
        variables: {data: {}}, onComplete: () => {
            show({message: 'Action status saved successfully', type: {success: true}})
            onUpdate();
            onClose();
        },
        onError: error => {
            show({message: error?.message || error.toString()})
        }
    })

    const generatePayload = (data) => {
        console.log(action);
        const actionStatus = new ActionStatus();
        actionStatus.setValuesFromForm({...data, actionId: action?.id});
        return actionStatus.getPayload(orgUnit?.id)
    }
    return (
        <Modal className="dialog-container" onClose={onClose}>
            <ModalTitle>Add Action Status</ModalTitle>
            <ModalContent>
                <CustomForm formFields={formFields} control={control} errors={errors}/>
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button secondary onClick={onClose}>Hide</Button>
                    <Button type="submit" onClick={handleSubmit(onSubmit)} primary>
                        {
                            saving ? 'Saving...': 'Save Action Status'
                        }
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
