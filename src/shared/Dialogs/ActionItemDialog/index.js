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

const actionMutation = {
    type: 'create',
    resource: 'trackedEntityInstances',
    data: ({data})=>data
}

export function ActionItemDialog({onClose, onUpdate, solution}) {
    const {orgUnit} = useRecoilValue(DimensionsState);
    const {actionProgramMetadata} = useRecoilValue(ConfigState);
    const metadataFields = Action.getFormFields(actionProgramMetadata);
    const {control, errors, handleSubmit} = useForm({
        mode: 'onBlur',
        reValidateMode: 'onBlur',
    });
    const formFields = getFormattedFormMetadata(metadataFields);
    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}))
    const [mutate, {loading: saving}] = useDataMutation(actionMutation, {
        variables: {data: {}}, onComplete: () => {
            show({message: 'Action saved successfully', type: {success: true}})
            onUpdate();
            onClose();
        },
        onError: error => {
            show({message: error?.message || error.toString()})
        }
    })

    const onSubmit = (payload) => {
        mutate({
            data: generatePayload(payload)
        })
    };

    const generatePayload = (data) => {
        const action = new Action();
        action.setValuesFromForm({...data, solutionLinkage: solution?.actionLinkage});
        return action.getPayload(orgUnit?.id);
    }


    return (
        <Modal className="dialog-container" onClose={onClose}>
            <ModalTitle>Add Action Item</ModalTitle>
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
