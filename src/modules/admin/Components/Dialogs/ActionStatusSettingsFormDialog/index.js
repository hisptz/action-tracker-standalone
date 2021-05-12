import PropTypes from 'prop-types';
import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    Button,
    ButtonStrip,
} from '@dhis2/ui';
import {useAlert} from '@dhis2/app-runtime';
import {useForm} from 'react-hook-form';
import {ConfigState, DataEngineState} from '../../../../../core/states';
import {useRecoilValue} from 'recoil';
import {getFormattedFormMetadata} from '../../../../../core/helpers/utils/form.utils';
import CustomForm from '../../../../../shared/Components/CustomForm';
import {confirmModalClose, uid} from '../../../../../core/helpers/utils/utils';
import ActionStatusOptionSetConstants from "../../ActionStatusLegend/constants/actionStatus";
import {
    onMetadataCompleteHandler,
    onMetadataErrorHandler
} from "../../../../../core/services/errorHandling.service";
import _ from 'lodash';
import useOptionsMutation from "../../../hooks/option";

import React from 'react';
import {Typography} from "@material-ui/core";

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
                        if (control?.defaultValuesRef?.current?.name?.value === value.trim()) {
                            return true;
                        } else {
                            try {
                                if (value.length > 50) {
                                    return `${field.formName} should not exceed 50 characters`
                                } else {
                                    const {options} = await engine.query(validationQuery, {
                                        variables: {
                                            field: 'name',
                                            value: value.trim()
                                        }
                                    });
                                    return _.isEmpty(options.options) || `Option with name ${value} already exists`
                                }
                            } catch (e) {
                                return e.message || e.toString()
                            }
                        }
                    } : async ({value}, __, control) => {
                        if (control?.defaultValuesRef?.current?.code?.value === value.trim()) {
                            return true;
                        } else {
                            try {
                                if (value.length > 50) {
                                    return `${field.formName} should not exceed 50 characters`
                                } else {
                                    const {options} = await engine.query(validationQuery, {
                                        variables: {
                                            field: 'code',
                                            value: value.trim()
                                        }
                                    });
                                    return _.isEmpty(options?.options) || `Option with code ${value} already exists`
                                }

                            } catch (e) {
                                return e.message || e.toString();
                            }
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
                                            optionSet
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

    const {show} = useAlert(
        ({message}) => message,
        ({type}) => ({duration: 3000, ...type})
    );
    const {loading: saving, mutate, error} = useOptionsMutation(actionStatusOption ? 'update' : 'create', optionSet, {
        onComplete: (importSummary) => {
            onMetadataCompleteHandler(importSummary, show, {
                message: 'Action status option saved successfully',
                onClose,
                onUpdate
            });
        },
        onError: error => {
            onMetadataErrorHandler(error, show);
        }
    })

    const onSubmit = (data) => {
        mutate({
            ...generatePayload(data)
        });
    };

    const generatePayload = ({name, code, icon, color}) => {
        const sortOrder = optionSet?.options?.length + 1 || 1;
        return actionStatusOption ? {
            ...actionStatusOption,
            name: name.value,
            code: code.value,
            style: {
                color: color.value,
                icon: icon.value
            }
        } : {
            id: uid(),
            name: name.value,
            code: code.value,
            style: {
                color: color.value,
                icon: icon.value
            },
            optionSet: {
                id: ActionStatusOptionSetConstants.ACTION_STATUS_OPTION_SET_ID
            },
            sortOrder
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
                {error && <Typography variant={'p'}>{error?.message || error?.toString()}</Typography>}
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button secondary onClick={(_) => confirmModalClose(onClose)}>
                        Hide
                    </Button>
                    <Button disabled={saving} type="submit" onClick={handleSubmit(onSubmit)} primary>
                        {saving ? 'Saving...' : 'Save Action Status'}
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
