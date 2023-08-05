import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Template } from '../../../TemplateCard'
import { RHFDHIS2FormField } from '@hisptz/dhis2-ui'
import { Button, ButtonStrip } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import { useSaveConfigFromTemplate } from '../../hooks/save'
import { useAlert } from '@dhis2/app-runtime'
import { useNavigate } from 'react-router-dom'

export interface InitialConfigProps {
    template: Template
}

export function InitialConfig ({ template }: InitialConfigProps) {
    const { show } = useAlert(({ message }) => message, ({ type }) => ({
        ...type,
        duration: 3000
    }))
    const navigate = useNavigate()
    const form = useForm({
        defaultValues: template.defaultVariables
    })
    const fields = template.variables

    const {
        save,
        saving,
        error
    } = useSaveConfigFromTemplate()

    const onSubmit = async (data: any) => {
        const config = template?.configGenerator(data)
        if (!config) {
            throw Error(i18n.t('Error setting up selected configuration'))
        }
        await save(config)
        show({
            message: i18n.t('Initial configuration setup complete.'),
            type: { success: true }
        })
        navigate(`/${config.id}/config/general?initial=true`)
    }

    const title = template?.title

    return (
        <div className="column gap-16 align-center center h-100">
            <h3>{i18n.t('Setting up {{title }} configuration', {
                title
            })}</h3>
            <div style={{
                width: 400,
                alignItems: 'stretch'
            }} className="column gap-8">
                <FormProvider {...form} >
                    {
                        fields?.map((field) => (
                            <RHFDHIS2FormField key={`${field.name}-form-field`}{...field} />))
                    }
                </FormProvider>
            </div>
            <ButtonStrip>
                <Button onClick={() => navigate(-1)}>{i18n.t('Go back')}</Button>
                <Button onClick={form.handleSubmit(onSubmit)} loading={saving}
                        primary>{saving ? i18n.t('Please wait...') : i18n.t('Save')}</Button>
            </ButtonStrip>
        </div>
    )
}
