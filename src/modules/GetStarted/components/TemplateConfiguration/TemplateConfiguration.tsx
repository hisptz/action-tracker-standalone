import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { configTemplates } from '../../../../shared/constants/templates'
import { useSaveConfigFromTemplate } from './hooks/save'
import { isEmpty } from 'lodash'
import i18n from '@dhis2/d2-i18n'
import { CircularLoader } from '@dhis2/ui'
import { useAlert } from '@dhis2/app-runtime'

export function TemplateConfiguration () {
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
            if (isEmpty(selectedTemplate?.configs)) {
                const config = selectedTemplate?.configGenerator()
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
        }

        get()
    }, [])

    const title = selectedTemplate?.title

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
