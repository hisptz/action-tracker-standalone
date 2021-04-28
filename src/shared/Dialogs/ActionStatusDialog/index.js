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
import {generateImportSummaryErrors, onCompleteHandler, onErrorHandler} from "../../../core/services/errorHandling";
import {confirmModalClose} from "../../../core/helpers/utils";
import {ActionStatusConstants} from "../../../core/constants";

const actionStatusEditMutation = {
    type: 'update',
    resource: 'events',
    id: ({id}) => id,
    data: ({data}) => data
}
const actionStatusCreateMutation = {
    type: 'create',
    resource: 'events',
    data: ({data}) => data
}

function getFormDate(date = new Date()) {
    return `${date.getFullYear()}-${_.padStart((date.getMonth() + 1), 2, '0')}-${_.padStart(date.getDate(), 2, '0')}`
}

function getValidatedFormFields(metadataFields, {startDate, endDate}) {
    const formFields = getFormattedFormMetadata(metadataFields);
    _.forEach(formFields, (field) => {
        if (field.id === ActionStatusConstants.REVIEW_DATE_DATA_ELEMENT) {
            field.max = getFormDate(endDate);
            field.min = getFormDate(startDate);
        }
    })
    return formFields;
}

export function ActionStatusDialog({onClose, action, onUpdate, actionStatus, startDate, endDate}) {
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
        defaultValues: actionStatus?.getFormValues()
    });
    const formFields = getValidatedFormFields(metadataFields, {startDate, endDate});
    const [mutate, {loading: saving}] = useDataMutation(actionStatus ? actionStatusEditMutation : actionStatusCreateMutation, {
        variables: {data: {}, id: actionStatus?.id},
        onComplete: (importSummary) => {
            onCompleteHandler(importSummary, show, {message: 'Action status saved successfully', onClose, onUpdate})
        },
        onError: error => {
            onErrorHandler(error, show);
        }
    })

    const generatePayload = (data) => {
        if (actionStatus) {
            actionStatus.setValuesFromForm(data);
            return actionStatus.getPayload(orgUnit?.id)
        } else {
            const actionStatus = new ActionStatus();
            actionStatus.setValuesFromForm({...data, actionId: action?.id});
            return actionStatus.getPayload(orgUnit?.id)
        }

    }
    return (
        <Modal className="dialog-container" onClose={_ => confirmModalClose(onClose)}>
            <ModalTitle>Add Action Status</ModalTitle>
            <ModalContent>
                <CustomForm formFields={formFields} control={control} errors={errors}/>
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button secondary onClick={_ => confirmModalClose(onClose)}>Hide</Button>
                    <Button type="submit" onClick={handleSubmit(onSubmit)} primary>
                        {
                            saving ? 'Saving...' : 'Save Action Status'
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
