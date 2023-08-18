import React, { useMemo } from 'react'
import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import { FormProvider, useForm } from 'react-hook-form'
import { type DataField } from '../../schemas/config'
import { RHFCheckboxField, RHFSingleSelectField, RHFTextInputField } from '@hisptz/dhis2-ui'
import { capitalize, isEmpty } from 'lodash'
import { SUPPORTED_VALUE_TYPES } from '../../constants/meta'
import { OptionSetField } from './components/OptionSetField'
import { uid } from '@hisptz/dhis2-utils'
import { HelpIcon } from '../HelpButton'
import { NewDataItemSteps } from '../../../modules/Config/components/Categories/docs/steps'

export interface DataItemManageFormProps {
    hide: boolean
    type: 'dataElement' | 'attribute'
    onClose: () => void
    onAdd: (data: DataField) => void;
    defaultValue?: DataField | null;
    actionTable?: boolean,
    excludeFieldTypes?: string[]
}

export function DataItemManageForm ({
                                        onClose,
                                        onAdd,
                                        hide,
                                        type,
                                        defaultValue,
                                        actionTable,
                                        excludeFieldTypes
                                    }: DataItemManageFormProps) {
    const form = useForm<DataField>({
        defaultValues: defaultValue ?? {},
        shouldFocusError: false
    })

    const onCloseClick = () => {
        form.reset({})
        onClose()
    }
    const onSubmit = (data: DataField) => {
        onAdd({
            ...data,
            id: data.id ?? uid()
        })
        onCloseClick()
    }

    const valueTypes = useMemo(() => {
        if (isEmpty(excludeFieldTypes)) {
            return SUPPORTED_VALUE_TYPES.map((type: string) => ({
                label: capitalize(type.replaceAll(/_/g, ' ')),
                value: type
            }))
        } else {
            const filteredValueTypes = SUPPORTED_VALUE_TYPES.filter((type) => !excludeFieldTypes?.includes(type))
            return filteredValueTypes.map((type: string) => ({
                label: capitalize(type.replaceAll(/_/g, ' ')),
                value: type
            }))
        }
    }, [excludeFieldTypes])

    return (
        <Modal position="middle" onClose={onCloseClick} hide={hide}>
            <ModalTitle>
                <div className="row gap-8">
                    {i18n.t('Add Data Item')}
                    <HelpIcon steps={NewDataItemSteps} key="new-data-item-steps"/>
                </div>
            </ModalTitle>
            <ModalContent>
                <FormProvider {...form} >
                    <form className="column gap-16">
                        <div className="display-name-config-container">
                            <RHFTextInputField required validations={{ required: i18n.t('Name is required') }}
                                               name={'name'}
                                               label={i18n.t('Display name')}/>
                        </div>
                        <div className="short-name-config-container">
                            <RHFTextInputField required validations={{ required: i18n.t('Short name is required') }}
                                               name={'shortName'}
                                               label={i18n.t('Short name')}/>
                        </div>
                        <div className="type-config-container">
                            <RHFSingleSelectField required validations={{ required: i18n.t('Type is required') }}
                                                  options={valueTypes}
                                                  name={'type'} label={i18n.t('Type')}/>
                        </div>
                        <div className="option-set-selector-container">
                            <OptionSetField name={`optionSet.id`} label={i18n.t('Option set')}/>
                        </div>
                        <div className="mandatory-check-container">
                            <RHFCheckboxField name={`mandatory`} label={i18n.t('Field should be mandatory')}/>
                        </div>
                        <div className="show-in-column-field">
                            {
                                type === 'attribute' && !actionTable
                                    ? (
                                        <RHFCheckboxField name={`header`} label={i18n.t('Show field as header')}/>
                                    )
                                    : (
                                        <RHFCheckboxField name={`showAsColumn`} label={i18n.t('Show field as column')}/>
                                    )
                            }
                        </div>
                    </form>
                </FormProvider>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button dataTest="cancel-data-item-btn" onClick={onCloseClick}>{i18n.t('Cancel')}</Button>
                    <Button dataTest="add-data-item-btn" primary
                            onClick={form.handleSubmit(onSubmit)}>{defaultValue ? i18n.t('Update') : i18n.t('Add')}</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>

    )
}
