import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    Button,
    ButtonStrip,
    CenteredContent
} from '@dhis2/ui';
import DataFilter from '../../Components/DataFilter';
import {useForm, Controller} from 'react-hook-form';
import useIndicators from "../../../core/hooks/indicators";
import {useRecoilValue} from "recoil";
import {DimensionsState} from "../../../core/states";
import Bottleneck from "../../../core/models/bottleneck";
import {useAlert, useDataMutation} from "@dhis2/app-runtime";
import {confirmModalClose} from "../../../core/helpers/utils";
import {generateImportSummaryErrors, onCompleteHandler, onErrorHandler} from "../../../core/services/errorHandling";

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
    const {indicators, loading: indicatorsLoading, error: indicatorsError} = useIndicators(0);
    const [mutate, {loading: saving, data}] = useDataMutation(challenge ? challengeEditMutation : challengeCreateMutation, {
        variables: {data: {}, id: challenge?.id},
        onComplete: (importSummary) => {
            onCompleteHandler(importSummary, show, {message: 'Challenge saved successfully', onClose, onUpdate})
        },
        onError: error => {
            onErrorHandler(error, show);
        }
    })
    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}))

    const {handleSubmit, control, errors} = useForm({
        mode: 'onBlur',
        reValidateMode: 'onBlur',
        defaultValues: challenge && {
            indicator: [Object.values(challenge?.getFormValues())[0]]
        }
    });

    const onSubmit = (payload) => {
        mutate(
            {
                data: generatePayload(payload)
            }
        )
    };
    const generatePayload = (payload) => {
        if (challenge) {
            challenge.setValuesFromForm({indicator: payload.indicator[0]});
            return challenge.getPayload([], orgUnit.id);
        } else {
            const challenge = new Bottleneck();
            challenge.setValuesFromForm({indicator: payload.indicator[0]});
            return challenge.getPayload([], orgUnit.id)
        }
    }

    return (
        <Modal className="dialog-container" onClose={_ => confirmModalClose(onClose)} large>
            <ModalTitle>{challenge ? 'Change' : 'Select'} Indicator</ModalTitle>
            <ModalContent>
                <Controller
                    control={control}
                    name='indicator'
                    rules={{required: 'Please choose an indicator'}}
                    render={({onChange, value}) => (
                        <DataFilter
                            options={indicators?.map(({displayName, id}) => ({label: displayName, value: id}))}
                            initiallySelected={value}
                            getSelected={onChange}
                            loading={indicatorsLoading}
                            error={errors?.indicator || indicatorsError}
                        />
                    )}
                />
                {
                    errors?.indicator &&
                    <CenteredContent><p style={{fontSize: 12, color: 'red'}}>{errors?.indicator?.message}</p>
                    </CenteredContent>
                }
                {
                    indicatorsError &&
                    <CenteredContent><p style={{
                        fontSize: 12,
                        color: 'red'
                    }}>{indicatorsError?.message || indicatorsError.toString()}</p>
                    </CenteredContent>
                }
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onClose}>Hide</Button>
                    <Button primary onClick={handleSubmit(onSubmit)}>{saving ? 'Saving...' : 'Save Indicator'}</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
}

export default ChallengeDialog;
