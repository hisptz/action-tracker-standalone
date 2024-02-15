import React from 'react'
import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import { DataField } from '../../schemas/config'
import { FormProvider, useForm } from 'react-hook-form'
import { useDataItems } from './hooks/data'
import { RHFCheckboxField, RHFSingleSelectField } from '@hisptz/dhis2-ui'
import { find } from 'lodash'
import { useAlert } from '@dhis2/app-runtime'
import { HelpIcon } from '../HelpButton'
import { ExistingMetadataSteps } from '../../../modules/Config/components/Categories/docs/steps'

export interface DataItemSelectProps {
    type: 'dataElement' | 'attribute',
    hide: boolean;
    onClose: () => void;
    onAdd: (data: DataField) => void;
    filtered: string[],
    excludeFieldTypes?: string[]
}

export function DataItemSelect ({
                                    type,
                                    hide,
                                    onAdd,
                                    onClose,
                                    filtered,
                                    excludeFieldTypes,
                                }: DataItemSelectProps) {
    const {
        show,
        hide: hideAlert
    } = useAlert(({ message }) => message, ({ type }) => ({
        ...type,
        duration: 3000
    }))
    const {
        options,
        values,
        loading,
        error
    } = useDataItems(type, {
        filtered,
        excludeFieldTypes
    })
    const form = useForm<DataField>({})

    const onCloseClick = () => {
        form.reset()
        onClose()
    }
    const onSubmit = async (data: DataField) => {
        const selectedValue = find(values, ['id', data.id])
        if (!selectedValue) {
            show({
                message: `${i18n.t('Could not add the new data item. Please refresh the page and try again')}`,
                type: { critical: true }
            })
            await new Promise((resolve) => setTimeout(resolve, 5000))
            hideAlert()
            return
        }
        const sanitizedData: DataField = {
            ...data,
            type: selectedValue.valueType as any,
            name: selectedValue.formName || selectedValue.shortName || selectedValue.displayName,
            optionSet: selectedValue.optionSet
        }
        onAdd(sanitizedData)
        onCloseClick()
    }

    return (
        <Modal position="middle" hide={hide} onClose={onClose}>
            <ModalTitle>
                <div className="row gap-8">
                    {i18n.t('Select Data Item')}
                    <HelpIcon steps={ExistingMetadataSteps} key="existing-meta-field-steps"/>
                </div>
            </ModalTitle>
            <ModalContent>
                <FormProvider {...form} >
                    <form className="column gap-16">
                        <div data-test="data-item-select-container">
                            <RHFSingleSelectField
                                required
                                validations={{ required: i18n.t('Data item is required') }}
                                loading={loading} label={i18n.t('Data item')} options={options}
                                name={`id`}/>
                        </div>
                        <div data-test="mandatory-check-container">
                            <RHFCheckboxField name={`mandatory`} label={i18n.t('Field should be mandatory')}/>
                        </div>
                        <div data-test="show-in-table-container">
                            {
                                type === 'attribute' ? (
                                    <RHFCheckboxField name={`header`} label={i18n.t('Show field as header')}/>
                                ) : (
                                    <RHFCheckboxField name={`showAsColumn`} label={i18n.t('Show field as column')}/>
                                )
                            }
                        </div>
                    </form>
                </FormProvider>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button dataTest="cancel-data-item-select-btn" onClick={onCloseClick}>{i18n.t('Cancel')}</Button>
                    <Button dataTest="add-data-item-select-btn" onClick={form.handleSubmit(onSubmit)}
                            primary>{i18n.t('Add')}</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
