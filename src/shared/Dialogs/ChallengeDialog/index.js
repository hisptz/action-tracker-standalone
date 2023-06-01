import {Button, ButtonStrip, CenteredContent, Field, Modal, ModalActions, ModalContent, ModalTitle} from '@dhis2/ui';
import DataFilter from '../../Components/DataFilter';
import {Controller, useForm, useFormState} from 'react-hook-form';
import useIndicators from "../../../core/hooks/indicators";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {ConfigState, DimensionsState} from "../../../core/states";
import Bottleneck from "../../../core/models/bottleneck";
import {useAlert, useDataMutation} from "@dhis2/app-runtime";
import {confirmModalClose} from "../../../core/helpers/utils/utils";
import {onCompleteHandler, onErrorHandler} from "../../../core/services/errorHandling.service";
import {getFormattedFormMetadata} from "../../../core/helpers/utils/form.utils";
import FormField from "../../Components/CustomForm/Components/FormField";
import {BottleneckConstants} from "../../../core/constants";
import * as _ from "lodash"
import i18n from '@dhis2/d2-i18n'
import {DownloadRequestId} from "../../../modules/main/Components/Download/state/download";

const challengeEditMutation = {
    type: 'update',
    resource: 'trackedEntityInstances',
    id: ({id}) => id,
    data: ({data}) => data
}
const challengeCreateMutation = {
    type: 'create',
    resource: 'trackedEntityInstances',
    data: ({data}) => data
}


function ChallengeDialog({onClose, onUpdate, challenge}) {
    const {orgUnit} = useRecoilValue(DimensionsState);
    const {bottleneckProgramMetadata} = useRecoilValue(ConfigState);
    const formFields = Bottleneck.getFormFields(bottleneckProgramMetadata);
    const validatedFormFields = getFormattedFormMetadata(formFields)
    const setDownloadDataRequestId = useSetRecoilState(DownloadRequestId);
    const [mutate, {
        loading: saving,
    }] = useDataMutation(challenge ? challengeEditMutation : challengeCreateMutation, {
        variables: {data: {}, id: challenge?.id},
        onComplete: (importSummary) => {
            setDownloadDataRequestId(prevState=>prevState + 1)
            onCompleteHandler(importSummary, show, {
                message: i18n.t('Intervention saved successfully'),
                onClose,
                onUpdate
            })
        },
        onError: error => {
            onErrorHandler(error, show);
        }
    })

    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}))

    const {handleSubmit, control} = useForm({
        mode: 'onBlur',
        reValidateMode: 'onBlur',
        defaultValues: challenge?.getFormValues()
    });

    const {errors} = useFormState({control})

    const onSubmit = (data) => {
        mutate({data: generatePayload(data)})
    };
    const generatePayload = (data) => {
        if (challenge) {
            challenge.setValuesFromForm(data);
            return challenge.getPayload([], orgUnit.id);
        } else {
            const challenge = new Bottleneck();
            challenge.setValuesFromForm(data);
            return challenge.getPayload([], orgUnit.id)
        }
    }
    const interventionField = _.find(validatedFormFields, ['id', BottleneckConstants.INTERVENTION_ATTRIBUTE])
    const indicatorField = _.find(validatedFormFields, ['id', BottleneckConstants.INDICATOR_ATTRIBUTE])

    return (
        <Modal position='middle' dataTest='add-challenge-modal' className="dialog-container"
               onClose={_ => confirmModalClose(onClose)} large>
            <ModalTitle>{challenge ? i18n.t('Edit') : i18n.t('Add')} {i18n.t('Result Area')}</ModalTitle>
            <ModalContent>
                <FormField
                    field={interventionField}
                    key={interventionField.id}
                    control={control}
                />
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={_ => confirmModalClose(onClose)}>{i18n.t('Hide')}</Button>
                    <Button loading={saving} disabled={saving} primary
                            onClick={handleSubmit(onSubmit)}>{saving ? i18n.t('Saving...') : i18n.t('Save')}</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
}

export default ChallengeDialog;
