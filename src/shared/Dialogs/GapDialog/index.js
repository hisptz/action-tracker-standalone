import {Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle} from "@dhis2/ui";
import {confirmModalClose} from "../../../core/helpers/utils/utils";
import CustomForm from "../../Components/CustomForm";
import React from 'react';
import {useRecoilValue, useSetRecoilState} from "recoil";
import {ConfigState, DimensionsState} from "../../../core/states";
import Gap from "../../../core/models/gap";
import {getFormattedFormMetadata} from "../../../core/helpers/utils/form.utils";
import {useForm} from "react-hook-form";
import {useAlert, useDataMutation} from "@dhis2/app-runtime";
import {onCompleteHandler, onErrorHandler} from "../../../core/services/errorHandling.service";
import i18n from '@dhis2/d2-i18n'
import {DownloadRequestId} from "../../../modules/main/Components/Download/state/download";
function getFormattedMetadataFields(metadataFields) {
    return getFormattedFormMetadata(metadataFields);
}

const gapCreateMutation = {
    type: 'create',
    resource: 'events',
    data: ({data}) => data
}
const gapEditMutation = {
    type: 'update',
    resource: 'events',
    id: ({id}) => id,
    data: ({data}) => data
}


export default function GapDialog({onClose, gap, onUpdate, challenge}) {
    const {bottleneckProgramMetadata} = useRecoilValue(ConfigState);
    const {orgUnit} = useRecoilValue(DimensionsState);
    const setDownloadDataRequestId = useSetRecoilState(DownloadRequestId);
    const {control, errors, handleSubmit} = useForm({
            defaultValues: gap?.getFormValues() || {}
        }
    );
    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}));

    const [mutate, {loading: saving}] = useDataMutation(gap ? gapEditMutation : gapCreateMutation, {
        variables: {data: {}, id: gap?.id},
        onComplete: (importSummary) => {
            setDownloadDataRequestId(prevState=>prevState + 1)
            onCompleteHandler(importSummary, show, {message: i18n.t('Strategy saved successfully'), onClose, onUpdate})
        },
        onError: (error) => {
            onErrorHandler(error, show);
        }
    })

    const metadataFields = Gap.getFormFields(bottleneckProgramMetadata);
    const formFields = getFormattedMetadataFields(metadataFields);
    const onSubmit = (payload) => {
        mutate(
            {
                data: generatePayload(payload)
            }
        )
    };

    const generatePayload = (payload) => {
        if (gap) {
            gap.setValuesFromForm(payload);
            return gap.getPayload(orgUnit?.id);
        } else if (challenge) {
            const newGap = new Gap();
            newGap.setValuesFromForm(payload);
            newGap.indicatorId = challenge?.id;
            return newGap.getPayload(orgUnit?.id)
        }

    }

    return (
        <Modal className="dialog-container" onClose={_ => confirmModalClose(onClose)} large>
            <ModalTitle>{gap ? i18n.t('Edit') : i18n.t('Add')} {i18n.t('Strategy')}</ModalTitle>
            <ModalContent>
                {
                    <CustomForm
                        formFields={formFields}
                        control={control}
                        errors={errors}
                    />
                }
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button
                        onClick={_ => confirmModalClose(onClose)}
                    >
                        {
                            i18n.t('Hide')
                        }
                    </Button>
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        primary
                        disabled={saving}
                    >
                        {
                            saving ? i18n.t('Saving...') : i18n.t('Save')
                        }
                    </Button>

                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
