import {Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle} from "@dhis2/ui";
import {confirmModalClose} from "../../../core/helpers/utils";
import CustomForm from "../../Components/CustomForm";
import React from 'react';
import {useRecoilValue} from "recoil";
import {ConfigState, DimensionsState} from "../../../core/states";
import Gap from "../../../core/models/gap";
import {getFormattedFormMetadata} from "../../../core/helpers/formsUtilsHelper";
import {useForm} from "react-hook-form";
import {useAlert, useDataMutation} from "@dhis2/app-runtime";

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
    const {control, errors, handleSubmit, watch} = useForm({
            defaultValues: gap?.getFormValues() || {}
        }
    );
    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}));

    const [mutate, {loading: saving}] = useDataMutation(gap ? gapEditMutation : gapCreateMutation, {
        variables: {data: {}, id: gap?.id},
        onComplete: () => {
            show({message: 'Gap saved successfully', type: {success: true}})
            onUpdate();
            onClose();
        },
        onError: error => {
            show({message: error?.message || error.toString()})
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
            <ModalTitle>Gap</ModalTitle>
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
                        onClick={onClose}
                    >
                        Hide
                    </Button>
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        primary
                    >
                        {
                            saving ? 'Saving...' : 'Save Gap'
                        }
                    </Button>

                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
