import React from 'react'
import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import { FormProvider, useForm } from 'react-hook-form'
import { Option, OptionSet } from '../../../../../../../../shared/types/dhis2'
import { RHFTextInputField } from '@hisptz/dhis2-ui'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { RHFColorField } from './components/ColorField'
import { RHFIconField } from './components/IconField'
import { useManageOptions } from '../../hooks/save'

const optionSchema = z.object({
    name: z.string().max(50, i18n.t('Name should not exceed 50 characters')),
    code: z.string().max(50, i18n.t('Code should not exceed 50 characters')),
    style: z.object({
        color: z.string().startsWith('#', i18n.t('Color should be in hex')),
        icon: z.string()
    })
})

export interface OptionFormProps {
    refetch: () => void;
    optionSet: OptionSet;
    defaultValue?: Partial<Option> | null,
    hide: boolean;
    onClose: () => void
}

export function OptionForm ({
                                defaultValue,
                                hide,
                                onClose,
                                optionSet,
                                refetch,
                            }: OptionFormProps) {
    const form = useForm<Partial<Option>>({
        defaultValues: defaultValue ?? {},
        resolver: zodResolver(optionSchema)
    })

    const onCloseClick = () => {
        form.reset({})
        onClose()
    }

    const onSaveComplete = () => {
        onCloseClick()
        refetch()
    }

    const {
        onSave,
        saving
    } = useManageOptions(optionSet, onSaveComplete, defaultValue)

    const onSubmit = (data: Partial<Option>) => onSave(data)

    return (
        <Modal position="middle" hide={hide} onClose={onCloseClick}>
            <ModalTitle>
                {i18n.t('Update option')}
            </ModalTitle>
            <ModalContent>
                <FormProvider {...form} >
                    <div className="column gap-16">
                        <RHFTextInputField required name={'name'} label={i18n.t('Name')}/>
                        <RHFTextInputField required disabled={!!defaultValue} name={'code'} label={i18n.t('Code')}/>
                        <RHFIconField required name={'style.icon'} label={i18n.t('Icon')}/>
                        <RHFColorField required name={'style.color'} label={i18n.t('Color')}/>
                    </div>
                </FormProvider>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onCloseClick}>{i18n.t('Cancel')}</Button>
                    <Button loading={saving} primary
                            onClick={form.handleSubmit(onSubmit)}>{saving ? i18n.t('Saving...') : i18n.t('Save')}</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
