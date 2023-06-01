import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    Button,
    ButtonStrip,
} from '@dhis2/ui';
import CustomForm from '../../Components/CustomForm';
import {useForm} from 'react-hook-form';
import {useRecoilValue, useSetRecoilState} from "recoil";
import {ConfigState, DimensionsState} from "../../../core/states";
import {confirmModalClose} from "../../../core/helpers/utils/utils";
import PossibleSolution from "../../../core/models/possibleSolution";
import {getFormattedFormMetadata} from "../../../core/helpers/utils/form.utils";
import {useAlert, useDataMutation} from "@dhis2/app-runtime";
import {
    onCompleteHandler,
    onErrorHandler
} from "../../../core/services/errorHandling.service";
import i18n from '@dhis2/d2-i18n'
import {DownloadRequestId} from "../../../modules/main/Components/Download/state/download";
const solutionEditMutation = {
    type: 'update',
    resource: 'events',
    id: ({id}) => id,
    data: ({data}) => data
}
const solutionCreateMutation = {
    type: 'create',
    resource: 'events',
    data: ({data}) => data
}

function SolutionsDialog({onClose, gap, onUpdate, solution}) {
    const {orgUnit} = useRecoilValue(DimensionsState);
    const {bottleneckProgramMetadata} = useRecoilValue(ConfigState);
    const setDownloadDataRequestId = useSetRecoilState(DownloadRequestId);
    const formFields = getFormattedFormMetadata(PossibleSolution.getFormFields(bottleneckProgramMetadata));
    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}))
    const onSubmit = (payload) => {
        mutate({
            data: generatePayload(payload)
        })
    };
    const {control, errors, handleSubmit} = useForm({
        mode: 'onBlur',
        reValidateMode: 'onBlur',
        defaultValues: solution?.getFormValues()
    });
    const [mutate, {loading: saving}] = useDataMutation(solution ? solutionEditMutation : solutionCreateMutation, {
        variables: {data: {}, id: solution?.id},
        onComplete: (importSummary) => {
            setDownloadDataRequestId(prevState=>prevState + 1)
            onCompleteHandler(importSummary, show, {message: i18n.t('Activity saved successfully'), onClose, onUpdate})
        },
        onError: error => {
            onErrorHandler(error, show);
        }
    })

    const generatePayload = (payload) => {
        if (solution) {
            solution.setValuesFromForm(payload);
            return solution.getPayload(orgUnit?.id);
        } else {
            const possibleSolution = new PossibleSolution();
            possibleSolution.setValuesFromForm({
                ...payload,
                gapLinkage: gap?.solutionLinkage,
                indicatorId: gap?.indicatorId
            })
            return possibleSolution.getPayload(orgUnit?.id)
        }
    }

    return (
        <Modal className="dialog-container" onClose={_ => confirmModalClose(onClose)}>
            <ModalTitle> {solution ? i18n.t('Edit') : i18n.t('Add')} {i18n.t('Activity')} </ModalTitle>
            <ModalContent>
                <CustomForm formFields={formFields} control={control} errors={errors}/>
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button secondary onClick={_ => confirmModalClose(onClose)}>
                        {i18n.t('Hide')}
                    </Button>
                    <Button disabled={saving} type="submit" onClick={handleSubmit(onSubmit)} primary>
                        {
                            saving ?
                                i18n.t('Saving...') : i18n.t('Save')
                        }
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
}

export default SolutionsDialog;
