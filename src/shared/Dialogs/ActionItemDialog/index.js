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
import {confirmModalClose, getFormattedDateFromPeriod} from "../../../core/helpers/utils";
import {ActionConstants} from "../../../core/constants";
import {onCompleteHandler, onErrorHandler} from "../../../core/services/errorHandling";
import {getJSDate} from "../../../core/services/dateUtils";
import {Period} from "@iapps/period-utilities";

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


function getValidatedFormFields(metadataFields = [], period) {
    const formFields = getFormattedFormMetadata(metadataFields) || [];
    const startDateFieldIndex = _.findIndex(formFields, ['id', ActionConstants.START_DATE_ATTRIBUTE]);
    const endDateFieldIndex = _.findIndex(formFields, ['id', ActionConstants.END_DATE_ATTRIBUTE]);
    if (period) {
            if (startDateFieldIndex >= 0) {
                _.set(formFields, [startDateFieldIndex, 'min'], getFormattedDateFromPeriod(period.startDate));
                _.set(formFields, [startDateFieldIndex, 'max'], getFormattedDateFromPeriod(period.endDate));
            }
            if (endDateFieldIndex >= 0) {
                _.set(formFields, [endDateFieldIndex, 'min'], getFormattedDateFromPeriod(period.startDate))
                _.set(formFields, [endDateFieldIndex, 'max'], getFormattedDateFromPeriod(period.endDate))
            }
    }
    if (endDateFieldIndex >= 0) {
        _.set(formFields, [endDateFieldIndex, 'dependants'], [...endDateFieldIndex.dependants || [], ActionConstants.START_DATE_ATTRIBUTE]);
        _.set(formFields, [endDateFieldIndex, 'validations'], {
            ...formFields[endDateFieldIndex].validations,
            customValidate: (value, dependants) => {
                const startDate = getJSDate(_.find(dependants, ['name', ActionConstants.START_DATE_ATTRIBUTE])?.value);
                const endDate = getJSDate(value?.value);
                return (endDate > startDate) || 'The end date should be after start date'
            }
        })

    }
    return formFields;
}

export function ActionItemDialog({onClose, onUpdate, solution, action}) {
    const {orgUnit, period} = useRecoilValue(DimensionsState);
    const {actionProgramMetadata} = useRecoilValue(ConfigState);
    const metadataFields = Action.getFormFields(actionProgramMetadata);
    const {control, handleSubmit} = useForm({
        mode: 'onBlur',
        reValidateMode: 'onBlur',
        defaultValues: action?.getFormValues()
    });
    const formFields = getValidatedFormFields(metadataFields, period);
    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}))
    const [mutate, {loading: saving}] = useDataMutation(action ? actionEditMutation : actionCreateMutation, {
        variables: {data: {}, id: action?.id},
        onComplete: (importSummary) => {
            onCompleteHandler(importSummary, show, {message: 'Action saved successfully', onClose, onUpdate})
        },
        onError: error => {
            onErrorHandler(error, show);
        }
    });
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
            return action.getPayload([], orgUnit?.id);
        }
    }

    return (
        <Modal className="dialog-container" onClose={_ => confirmModalClose(onClose)}>
            <ModalTitle>{action ? 'Edit' : 'Add'} Action Item</ModalTitle>
            <ModalContent>
                <CustomForm formFields={formFields} control={control}/>
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button secondary onClick={_ => confirmModalClose(onClose)}>Hide</Button>
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
