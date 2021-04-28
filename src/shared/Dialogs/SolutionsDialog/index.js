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
import {useRecoilValue} from "recoil";
import {ConfigState, DimensionsState} from "../../../core/states";
import {confirmModalClose} from "../../../core/helpers/utils";
import PossibleSolution from "../../../core/models/possibleSolution";
import {getFormattedFormMetadata} from "../../../core/helpers/formsUtilsHelper";
import {useAlert, useDataMutation} from "@dhis2/app-runtime";
import {generateImportSummaryErrors, onCompleteHandler, onErrorHandler} from "../../../core/services/errorHandling";

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
            onCompleteHandler(importSummary, show, {message: 'Solution saved successfully', onClose, onUpdate})
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
            <ModalTitle> {solution ? 'Edit': 'Add'} Possible Solution </ModalTitle>
            <ModalContent>
                <CustomForm formFields={formFields} control={control} errors={errors}/>
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button secondary onClick={_ => confirmModalClose(onClose)}>
                        Hide
                    </Button>
                    <Button type="submit" onClick={handleSubmit(onSubmit)} primary>
                        {
                            saving ?
                                'Saving...' : 'Save Solution'
                        }
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
}

export default SolutionsDialog;
