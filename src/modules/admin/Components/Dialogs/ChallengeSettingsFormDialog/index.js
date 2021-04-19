import PropTypes from 'prop-types';
import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    Button,
    ButtonStrip,
} from '@dhis2/ui';
import {useAlert, useDataMutation} from '@dhis2/app-runtime';
import {useForm} from 'react-hook-form';
import {ConfigState, DataEngineState} from '../../../../../core/states';
import {useRecoilValue} from 'recoil';
import {getFormattedFormMetadata} from '../../../../../core/helpers/formsUtilsHelper';
import CustomForm from '../../../../../shared/Components/CustomForm';
import {confirmModalClose} from '../../../../../core/helpers/utils';
import {onCompleteHandler, onMetadataErrorHandler} from "../../../../../core/services/errorHandling";
import ChallengeMethodConstants from "../../ChallengeMethods/constants/optionSets";

const createMethodQuery = {
    type: 'create',
    resource: 'options',
    data: ({data}) => data
}
const updateMethodQuery = {
    type: 'update',
    resource: 'options',
    data: ({data}) => data,
    id: ({id}) => id
}


const validationQuery = {
    options: {
        resource: 'options',
        params: ({field, value}) => ({
            filter: [
                `${field}:eq:${value}`
            ],
            fields: [
                'code',
                'name'
            ]
        })
    }
}

const setValidations = (formattedFormFields = [], engine) => {
    const formFields = formattedFormFields;
    formFields.forEach((field, index) => {
        _.set(formFields, [index, 'validations'], {
            ...field.validations,
            customValidate: field.id === 'name' ?
                async ({value}, __, control) => {
                    if (control.defaultValuesRef.current.name.value === value) {
                        return true;
                    } else {
                        const {options} = await engine.query(validationQuery, {variables: {field: 'name', value}});
                        return _.isEmpty(options.options) || `Option with name ${value} already exists`
                    }
                } : async ({value}, __, control) => {
                    if (control.defaultValuesRef.current.code.value === value) {
                        return true;
                    } else {
                        const {options} = await engine.query(validationQuery, {variables: {field: 'code', value}});
                        return _.isEmpty(options.options) || `Option with code ${value} already exists`
                    }
                }
        })
    });
    return formFields;
}

function ChallengeSettingsFormDialog({
                                         onClose,
                                         onUpdate,
                                         method,
                                     }) {
    const {challengeSettingsMetadata} = useRecoilValue(ConfigState);
    const {control, handleSubmit} = useForm({
        mode: 'all',
        reValidateMode: 'onBlur',
        defaultValues: {
            name: {name: 'name', value: method?.name},
            code: {name: 'code', value: method?.code}
        },
    });
    const engine = useRecoilValue(DataEngineState);
    const formFields = setValidations(getFormattedFormMetadata(challengeSettingsMetadata), engine);
    const {show} = useAlert(
        ({message}) => message,
        ({type}) => ({duration: 3000, ...type})
    );
    const [mutate, {loading: saving}] = useDataMutation(method ? updateMethodQuery : createMethodQuery, {
        variables: {data: {}, id: method?.id},
        onComplete: (importSummary) => {
            onCompleteHandler(importSummary, show, {message: 'Method saved successfully', onClose, onUpdate})
        },
        onError: error => {
            onMetadataErrorHandler(error, show);
        }
    })

    const onSubmit = (payload) => {
        mutate({
            data: generatePayload(payload)
        })
    };

    const generatePayload = ({name, code}) => {
        return method ? {
            ...method,
            name: name.value,
            code: code.value,
            optionSet: {
                id: ChallengeMethodConstants.CHALLENGE_METHOD_OPTION_SET_ID
            }
        } : {
            name: name.value,
            code: code.value,
            optionSet: {
                id: ChallengeMethodConstants.CHALLENGE_METHOD_OPTION_SET_ID
            }
        }
    }

    return (
        <Modal
            className="dialog-container"
            onClose={(_) => confirmModalClose(onClose)}
        >
            <ModalTitle>
                {method ? 'Edit' : 'Add'} Challenge Settings
            </ModalTitle>
            <ModalContent>
                <CustomForm formFields={formFields} control={control}/>
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button secondary onClick={(_) => confirmModalClose(onClose)}>
                        Hide
                    </Button>
                    <Button type="submit" onClick={handleSubmit(onSubmit)} primary>
                        {saving ? 'Saving...' : 'Save Method Option'}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
}

ChallengeSettingsFormDialog.propTypes = {
    onUpdate: PropTypes.func,
    onClose: PropTypes.func,
    method: PropTypes.object
};

export default ChallengeSettingsFormDialog;
