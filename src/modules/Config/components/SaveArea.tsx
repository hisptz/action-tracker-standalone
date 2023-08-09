import { useFormContext } from 'react-hook-form'
import { type Config } from '../../../shared/schemas/config'
import { Button, ButtonStrip } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { DATASTORE_NAMESPACE } from '../../../shared/constants/meta'
import { useAlert, useDataMutation } from '@dhis2/app-runtime'
import { useUpdateMetadata } from '../../../shared/hooks/metadata'
import { useConfiguration } from '../../../shared/hooks/config'
import { useNavigate } from 'react-router-dom'

const mutation = {
    resource: `dataStore/${DATASTORE_NAMESPACE}`,
    type: 'update',
    id: ({ data }: { data: Config }) => data?.id,
    data: ({ data }: { data: Config }) => data
}

export function SaveArea () {
    const { reset } = useConfiguration()
    const navigate = useNavigate()
    const {
        updateMetadataFromConfig,
        uploadingMetadata
    } = useUpdateMetadata()
    const {
        show,
        hide
    } = useAlert(({ message }) => message, ({ type }) => ({
        ...type,
        duration: 3000
    }))
    const form = useFormContext<Config>()
    const [update, { loading }] = useDataMutation(mutation as any, {
        onError: (error) => {
            show({
                message: `${i18n.t('Error saving changes') as string}: ${error.message}`,
                type: { critical: true }
            })
            new Promise((resolve) => setTimeout(resolve, 5000)).then(hide).catch(console.error)
        }
    })
    const onSave = async (data: Config) => {
        const response = await updateMetadataFromConfig(data)
        if (response === undefined) {
            return
        }
        await update({ data })
        show({
            message: i18n.t('Changes saved successfully'),
            type: { success: true }
        })
        reset()
        navigate('/', { replace: true })
    }
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'flex-end'
        }} className="row gap-16">
            <ButtonStrip>
                <Button disabled={!form.formState.isDirty}>
                    {i18n.t('Reset')}
                </Button>
                <Button loading={loading || uploadingMetadata} onClick={form.handleSubmit(onSave)} primary
                        disabled={!form.formState.isDirty || loading || uploadingMetadata}>
                    {uploadingMetadata ? i18n.t('Updating metadata...') : loading ? i18n.t('Saving...') : i18n.t('Save changes')}
                </Button>
            </ButtonStrip>
        </div>
    )
}
