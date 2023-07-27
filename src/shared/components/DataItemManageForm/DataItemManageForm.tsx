import React from 'react'
import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import { FormProvider, useForm } from 'react-hook-form'
import { type DataField } from '../../schemas/config'
import { RHFCheckboxField, RHFSingleSelectField, RHFTextInputField } from '@hisptz/dhis2-ui'
import { capitalize } from 'lodash'
import { SUPPORTED_VALUE_TYPES } from '../../constants/meta'
import { OptionSetField } from './components/OptionSetField'
import { uid } from '@hisptz/dhis2-utils'

export interface DataItemManageFormProps {
    hide: boolean
    type: "dataElement" | "attribute"
    onClose: () => void
    onAdd: (data: DataField) => void
}

export function DataItemManageForm({onClose, onAdd, hide, type}: DataItemManageFormProps) {
    const form = useForm<DataField>({})

    const onCloseClick = () => {
        form.reset();
        onClose();
    }
    const onSubmit = (data: DataField) => {
        onAdd({ ...data, id: data.id ?? uid()});
        onCloseClick();
    }

    const valueTypes = SUPPORTED_VALUE_TYPES.map((type: string) => ({
        label: capitalize(type.replaceAll(/_/g, ' ')),
        value: type
    }));

    return (
        <Modal position="middle" onClose={onCloseClick} hide={hide}>
            <ModalTitle>{i18n.t("Add Data Item")}</ModalTitle>
            <ModalContent>
                <FormProvider {...form} >
                    <form className="column gap-16">
                        <RHFTextInputField required validations={{required: i18n.t("Name is required")}} name={'name'}
                                           label={i18n.t("Display name")}/>
                        <RHFTextInputField required validations={{required: i18n.t("Short name is required")}}
                                           name={'shortName'}
                                           label={i18n.t("Short name")}/>
                        <RHFSingleSelectField required validations={{required: i18n.t("Type is required")}}
                                              options={valueTypes}
                                              name={'type'} label={i18n.t("Type")}/>
                        <OptionSetField name={`optionSet.id`} label={i18n.t("Option set")}/>
                        <RHFCheckboxField name={`mandatory`} label={i18n.t("Field should be mandatory")}/>
                        {
                            type === "attribute"
? (
                                <RHFCheckboxField name={`header`} label={i18n.t("Show field as header")}/>
                            )
: (
                                <RHFCheckboxField name={`showAsColumn`} label={i18n.t("Show field as column")}/>
                            )
                        }
                    </form>
                </FormProvider>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onCloseClick}>{i18n.t("Cancel")}</Button>
                    <Button primary onClick={form.handleSubmit(onSubmit)}>{i18n.t("Add")}</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>

    )
}
