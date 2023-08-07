import React from 'react'
import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import { FormProvider, useForm } from 'react-hook-form'
import { Option } from '../../../../../../../../shared/types/dhis2'
import { RHFTextInputField } from '@hisptz/dhis2-ui'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { RHFColorField } from './components/ColorField'
import { RHFIconField } from './components/IconField'

const optionSchema = z.object({
    name: z.string().max(50, i18n.t('Name should not exceed 50 characters')),
    code: z.string().max(50, i18n.t('Code should not exceed 50 characters')),
    style: z.object({
        color: z.string().startsWith('#', i18n.t('Color should be in hex')),
        icon: z.string()
    })
})

export interface OptionFormProps {
    defaultValue: Partial<Option>,
    hide: boolean;
    onClose: () => void
}

export function OptionForm ({
                                defaultValue,
                                hide,
                                onClose
                            }: OptionFormProps) {
    const form = useForm<Partial<Option>>({
        defaultValues: defaultValue,
        resolver: zodResolver(optionSchema)
    })

    const onCloseClick = () => {
        form.reset({})
        onClose()
    }

    const onSubmit = (data: Partial<Option>) => {

    }

    return (
        <Modal position="middle" hide={hide} onClose={onCloseClick}>
            <ModalTitle>
                {i18n.t('Update option')}
            </ModalTitle>
            <ModalContent>
                <FormProvider {...form} >
                    <div className="column gap-16">
                        <RHFTextInputField name={'name'} label={i18n.t('Name')}/>
                        <RHFTextInputField disabled name={'code'} label={i18n.t('Code')}/>
                        <RHFIconField name={'style.icon'} label={i18n.t('Icon')}/>
                        <RHFColorField name={'style.color'} label={i18n.t('Color')}/>
                    </div>
                </FormProvider>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onCloseClick}>{i18n.t('Cancel')}</Button>
                    <Button primary onClick={form.handleSubmit(onSubmit)}>{i18n.t('Save')}</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
