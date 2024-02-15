import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { configTemplates } from '../../../../shared/constants/templates'
import { useSaveConfigFromTemplate } from './hooks/save'
import { isEmpty } from 'lodash'
import i18n from '@dhis2/d2-i18n'
import { Button, CircularLoader } from '@dhis2/ui'
import { useAlert } from '@dhis2/app-runtime'
import { InitialConfig } from './components/InitialConfig'
import { useConfigurations } from '../../../../shared/hooks/config'

export function TemplateConfiguration () {
    const { reset } = useConfigurations()
    const { show } = useAlert(({ message }) => message, ({ type }) => ({
        ...type,
        duration: 3000
    }))
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const selectedTemplate = configTemplates.find(({ id: tempId }) => tempId === id)
    const {
        save,
        saving,
        error
    } = useSaveConfigFromTemplate()

    useEffect(() => {
        async function get () {
            if (isEmpty(selectedTemplate?.variables)) {
                const config = selectedTemplate?.configGenerator()
                if (!config) {
                    throw Error(i18n.t('Error setting up selected configuration'))
                }
                await save(config)
                show({
                    message: i18n.t('Initial configuration setup complete.'),
                    type: { success: true }
                })
                reset()
                navigate(`/${config.id}/config/general?initial=true`)
            }
        }

        get()
    }, [])

    if (!selectedTemplate) {

        return (
            <div className="w-100 h-100 center column align-center">
                <span>{i18n.t('Invalid configuration selected')}</span>
                <Button onClick={() => navigate('/getting-started')}>{i18n.t('Go back')}</Button>
            </div>
        )
    }

    const title = selectedTemplate?.title
    const configs = selectedTemplate?.variables

    if (!isEmpty(configs)) {

        return (
            <InitialConfig template={selectedTemplate}/>
        )
    }

    return (
        <div className="column align-center center h-100 w-100">
            <h3>{i18n.t('Setting up {{title }} configuration', {
                title
            })}</h3>
            {
                saving && (
                    <CircularLoader small/>
                )
            }
            {
                error && (
                    <div className="column gap-16 center align-center">
                        <span>{i18n.t('Error setting up configuration')}</span>
                        <code>
                            {error.message || error.toString()}
                        </code>
                    </div>
                )
            }
        </div>
    )
}
