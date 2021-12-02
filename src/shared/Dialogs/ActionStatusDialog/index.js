import PropTypes from 'prop-types';
import {Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle,} from '@dhis2/ui';
import CustomForm from '../../Components/CustomForm';
import {getFormattedFormMetadata} from '../../../core/helpers/utils/form.utils';
import {useForm} from 'react-hook-form';
import ActionStatus from "../../../core/models/actionStatus";
import {useRecoilValue} from "recoil";
import {ConfigState, DimensionsState} from "../../../core/states";
import {useAlert, useDataMutation} from "@dhis2/app-runtime";
import {onCompleteHandler, onErrorHandler} from "../../../core/services/errorHandling.service";
import {confirmModalClose} from "../../../core/helpers/utils/utils";
import {ActionStatusConstants} from "../../../core/constants";
import i18n from '@dhis2/d2-i18n'
import React from 'react'

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
        if (field.id === ActionStatusConstants.IMAGE_LINK_DATA_ELEMENT) {
            field.validations = {
                ...field.validations,
                pattern: {
                    value: RegExp("[(http(s)?):\\/\\/(www\\.)?a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)"),
                    message: i18n.t("Invalid URL")
                }
            };
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
            onCompleteHandler(importSummary, show, {
                message: i18n.t('Action status saved successfully'),
                onClose,
                onUpdate
            })
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
            <ModalTitle> {actionStatus ? i18n.t('Edit') : i18n.t('Add')} {i18n.t('Task Status')}</ModalTitle>
            <ModalContent>
                <CustomForm formFields={formFields} control={control} errors={errors}/>
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button secondary onClick={_ => confirmModalClose(onClose)}>{i18n.t('Hide')}</Button>
                    <Button disabled={saving} type="submit" onClick={handleSubmit(onSubmit)} primary>
                        {
                            saving ? i18n.t('Saving...') : i18n.t('Save')
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
