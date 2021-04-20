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
import ActionStatusOptionSetConstants from "../../ActionStatusLegend/constants/actionStatus";
import {onCompleteHandler, onMetadataErrorHandler} from "../../../../../core/services/errorHandling";
import _ from 'lodash';


const actionStatusSettingsCreateMutation = {
    resource: 'options',
    type: 'create',
    data: ({data}) => data
};
const actionStatusSettingsUpdateMutation = {
    resource: 'options',
    type: 'update',
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
        if (field.id === 'name' || field.id === 'code') {
            _.set(formFields, [index, 'validations'], {
                ...field.validations,
                customValidate: field.id === 'name' ?
                    async ({value}, __, control) => {
                        if (control?.defaultValuesRef?.current?.name?.value === value) {
                            return true;
                        } else {
                            const {options} = await engine.query(validationQuery, {variables: {field: 'name', value}});
                            return _.isEmpty(options.options) || `Option with name ${value} already exists`
                        }
                    } : async ({value}, __, control) => {

                        if (control?.defaultValuesRef?.current?.code?.value === value) {
                            return true;
                        } else {
                            const {options} = await engine.query(validationQuery, {variables: {field: 'code', value}});
                            return _.isEmpty(options.options) || `Option with code ${value} already exists`
                        }
                    }
            })
        }
    });
    return formFields;
}

function ActionStatusSettingsFormDialog({
                                            onClose,
                                            onUpdate,
                                            actionStatusOption,
                                        }) {
    const {actionStatusSettingsMetadata} = useRecoilValue(ConfigState);
    const engine = useRecoilValue(DataEngineState);
    const {control, handleSubmit} = useForm({
        mode: 'all',
        reValidateMode: 'onBlur',
        defaultValues: {
            name: actionStatusOption && {name: 'name', value: actionStatusOption?.name},
            code: actionStatusOption && {name: 'code', value: actionStatusOption?.code},
            color: actionStatusOption && {name: 'color', value: actionStatusOption?.style?.color},
            icon: actionStatusOption && {name: 'icon', value: actionStatusOption?.style?.icon},
        },
        criteriaMode: "firstError"
    });
    const formFields = setValidations(getFormattedFormMetadata(actionStatusSettingsMetadata), engine);

    console.log(formFields);
    const {show} = useAlert(
        ({message}) => message,
        ({type}) => ({duration: 3000, ...type})
    );
    const [mutate, {loading: saving}] = useDataMutation(actionStatusOption ? actionStatusSettingsUpdateMutation : actionStatusSettingsCreateMutation, {
        variables: {data: {}, id: actionStatusOption?.id},
        onComplete: (importSummary) => {
            onCompleteHandler(importSummary, show, {
                message: 'Action status option saved successfully',
                onClose,
                onUpdate
            })
        },
        onError: error => {
            onMetadataErrorHandler(error, show);
        }
    })

    const onSubmit = (payload) => {
        // mutate({
        //     data: generatePayload(payload)
        // })
        console.log(generatePayload(payload));
    };

    const generatePayload = ({name, code, icon, color}) => {
        return actionStatusOption ? {
            ...actionStatusOption,
            name: name.value,
            code: code.value,
            style: {
                color: color.value,
                icon: icon.value
            }
        } : {
            name: name.value,
            code: code.value,
            style: {
                color: color.value,
                icon: icon.value
            },
            optionSet: {
                id: ActionStatusOptionSetConstants.ACTION_STATUS_OPTION_SET_ID
            }
        }

    }

    return (
        <Modal
            className="dialog-container"
            onClose={(_) => confirmModalClose(onClose)}
        >
            <ModalTitle>
                {actionStatusOption ? 'Edit' : 'Add'} Action Status Setting
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
                        {saving ? 'Saving...' : 'Save Action Status Option'}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
}

ActionStatusSettingsFormDialog.propTypes = {
    onUpdate: PropTypes.func,
    onClose: PropTypes.func,
    actionStatusSetting: PropTypes.object
};

export default ActionStatusSettingsFormDialog;
