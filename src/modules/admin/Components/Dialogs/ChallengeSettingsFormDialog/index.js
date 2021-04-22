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
import {confirmModalClose, uid} from '../../../../../core/helpers/utils';
import {
    onCompleteHandler,
    onMetadataCompleteHandler,
    onMetadataErrorHandler
} from "../../../../../core/services/errorHandling";
import ChallengeMethodConstants from "../../ChallengeMethods/constants/optionSets";
import useOptionsMutation from "../../../hooks/option";

/*
* Procedure
*  1. url: https://vmi515671.contaboserver.net/staging/api/29/schemas/option
*       data: {code: "Option", sortOrder: 1, name: "Option", optionSet: {id: "e0LaGMS2UTb"}}
* method: POST
*       response: OK
*  2. url: https://vmi515671.contaboserver.net/staging/api/29/options
*       data: {code: "Option", sortOrder: 1, name: "Option", optionSet: {id: "e0LaGMS2UTb"}}
* method: POST
*       response: OK
*   3. url: https://vmi515671.contaboserver.net/staging/api/29/optionSets/e0LaGMS2UTb?mergeMode=REPLACE
*       method: PUT
*       data: {code: "Test", created: "2021-04-19T18:38:25.972", publicAccess: "rw------", attributeValues: [],…}
*
*
* Edit
*  1. url: https://vmi515671.contaboserver.net/staging/api/29/schemas/option
*       data: {code: "Option", sortOrder: 1, name: "Option", optionSet: {id: "e0LaGMS2UTb"}}
* method: POST
*       response: OK
*   2. url: https://vmi515671.contaboserver.net/staging/api/29/optionSets/e0LaGMS2UTb?mergeMode=REPLACE
*       method: PUT
*       data: {code: "Test", created: "2021-04-19T18:38:25.972", publicAccess: "rw------", attributeValues: [],…}
*
* Delete
* 1  url: https://vmi515671.contaboserver.net/staging/api/29/optionSets/e0LaGMS2UTb/options/GJyxK0tv4OG
*   method: DELETE
*
* 2 url:  https://vmi515671.contaboserver.net/staging/api/29/options/GJyxK0tv4OG
*
* */


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
            ...field?.validations,
            customValidate: field?.id === 'name' ?
                async ({value}, __, control) => {
                    if (control?.defaultValuesRef?.current?.name?.value === value.trim()) {
                        return true;
                    } else {
                        const {options} = await engine.query(validationQuery, {variables: {field: 'name', value: value.trim()}});
                        return _.isEmpty(options.options) || `Option with name ${value} already exists`
                    }
                } : async ({value}, __, control) => {
                    if (control?.defaultValuesRef?.current?.code?.value === value.trim()) {
                        return true;
                    } else {
                        const {options} = await engine.query(validationQuery, {variables: {field: 'code', value: value.trim()}});
                        return _.isEmpty(options?.options) || `Option with code ${value} already exists`
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
                                         optionSet
                                     }) {
    const {challengeSettingsMetadata} = useRecoilValue(ConfigState);
    const {control, handleSubmit} = useForm({
        mode: 'all',
        reValidateMode: 'onBlur',
        defaultValues: {
            name: method && {name: 'name', value: method?.name},
            code: method && {name: 'code', value: method?.code}
        },
    });
    const engine = useRecoilValue(DataEngineState);
    const formFields = setValidations(getFormattedFormMetadata(challengeSettingsMetadata), engine);
    const {show} = useAlert(
        ({message}) => message,
        ({type}) => ({duration: 3000, ...type})
    );
    const {
        loading: saving, mutate
    } = useOptionsMutation(method ? 'update' : 'create', optionSet, {
        onComplete: (importSummary) => {
            onMetadataCompleteHandler(importSummary, show, {message: 'Method saved successfully', onClose, onUpdate})
        },
        onError: error => {
            onMetadataErrorHandler(error, show);
        }
    })

    const onSubmit = (data) => {
        mutate({
            ...generatePayload(data)
        })
    };

    const generatePayload = ({name, code}) => {
        const sortOrder = optionSet?.options?.length + 1 || 1;
        return method ? {
            ...method,
            name: name.value,
            code: code.value,
            optionSet: {
                id: ChallengeMethodConstants.CHALLENGE_METHOD_OPTION_SET_ID
            }
        } : {
            id: uid(),
            name: name.value,
            code: code.value,
            sortOrder,
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