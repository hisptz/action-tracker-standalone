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
import './styles/ActionItemFormDialog.css'
import {getFormattedFormMetadata} from '../../../core/helpers/formsUtilsHelper';
import {useForm} from 'react-hook-form';
import {useRecoilValue} from "recoil";
import {ConfigState, DimensionsState} from "../../../core/states";
import Action from "../../../core/models/action";
import {useAlert, useDataMutation} from "@dhis2/app-runtime";
import ActionStatus from "../../../core/models/actionStatus";
import {confirmModalClose, getFormattedDate} from "../../../core/helpers/utils";
import {ActionConstants, ActionStatusConstants} from "../../../core/constants";
import {generateImportSummaryErrors, onCompleteHandler, onErrorHandler} from "../../../core/services/errorHandling";

const actionEditMutation = {
    type: 'update',
    resource: 'trackedEntityInstances',
    id: ({id}) => id,
    data: ({data}) => data
}
const actionCreateMutation = {
    type: 'create',
    resource: 'trackedEntityInstances',
    data: ({data}) => data
}

export function ActionItemDialog({onClose, onUpdate, solution, action}) {
    const {orgUnit} = useRecoilValue(DimensionsState);
    const {actionProgramMetadata} = useRecoilValue(ConfigState);
    const metadataFields = Action.getFormFields(actionProgramMetadata);
    const {control, errors, handleSubmit} = useForm({
        mode: 'onBlur',
        reValidateMode: 'onBlur',
        defaultValues: action?.getFormValues()
    });
    const formFields = getFormattedFormMetadata(metadataFields);
    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}))
    const [mutate, {loading: saving}] = useDataMutation(action ? actionEditMutation : actionCreateMutation, {
        variables: {data: {}, id: action?.id},
        onComplete: (importSummary) => {
            onCompleteHandler(importSummary, show, {message: 'Action saved successfully', onClose, onUpdate})
        },
        onError: error => {
            onErrorHandler(error, show);
        }
    })

    const onSubmit = (payload) => {
        mutate({
            data: generatePayload(payload)
        })
    };

    const generatePayload = (data) => {
        if (action) {
            action.setValuesFromForm(data);
            return action.getPayload([], orgUnit?.id)
        } else {
            const action = new Action();
            action.setValuesFromForm({...data, solution});
            const actionStatus = new ActionStatus();
            const defaultActionStatus = {};
            defaultActionStatus[`${ActionStatusConstants.STATUS_DATA_ELEMENT}`] = {
                name: `${ActionStatusConstants.STATUS_DATA_ELEMENT}`,
                value: 'Not started'
            };
            defaultActionStatus[`${ActionStatusConstants.REVIEW_DATE_DATA_ELEMENT}`] = {
                name: `${ActionStatusConstants.REVIEW_DATE_DATA_ELEMENT}`,
                value: data[ActionConstants.START_DATE_ATTRIBUTE]?.value
            }
            actionStatus.setValuesFromForm(defaultActionStatus) //TODO: Link this to the option sets
            return action.getPayload([actionStatus.getPayload()], orgUnit?.id);
        }
    }


    return (
        <Modal className="dialog-container" onClose={_ => confirmModalClose(onClose)}>
            <ModalTitle>{action ? 'Edit' : 'Add'} Action Item</ModalTitle>
            <ModalContent>
                <CustomForm formFields={formFields} control={control} errors={errors}/>
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button secondary onClick={onClose}>Hide</Button>
                    <Button type="submit" onClick={handleSubmit(onSubmit)} primary>
                        {
                            saving ? 'Saving...' : 'Save Action'
                        }
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
