import { Button } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useBoolean } from 'usehooks-ts'
import { DATASTORE_NAMESPACE } from '../../../../../shared/constants/meta'
import { useConfiguration } from '../../../../../shared/hooks/config'
import { useDataMutation, useDataQuery } from '@dhis2/app-runtime'
import { useController } from 'react-hook-form'
import { type SharingConfig } from '../../../../../shared/schemas/config'
import { head } from 'lodash'

const metaQuery: any = {
    meta: {
        resource: `dataStore/${DATASTORE_NAMESPACE}`,
        id: ({ id }: { id: string }) => `${id}/metaData`
    }
}

const namespace = 'general.sharing'

const accessMutation: any = {
    type: 'update',
    resource: 'sharing',
    data: ({ data }: any) => data,
    params: ({
                 type,
                 id
             }: any) => {
        return {
            type,
            id
        }
    }
}

export function Sharing () {
    const { field } = useController({
        name: namespace
    })
    const { config } = useConfiguration()
    const {
        data,
        loading,
        refetch
    } = useDataQuery<{
        meta: {
            id: string
            sharing: SharingConfig
        }
    }>(metaQuery, {
        variables: {
            id: config?.id
        }
    })

    const [updateProgramSharing] = useDataMutation(accessMutation)

    const metaId = data?.meta?.id

    const {
        value: hideSharing,
        setTrue: onHideSharing,
        setFalse: onOpenSharing
    } = useBoolean(true)

    const onClose = async () => {
        onHideSharing()
    }

    const onSave = async () => {
        onHideSharing()
        await refetch()
        const categoryProgram = head(config?.categories)
        await updateProgramSharing({
            id: categoryProgram?.id,
            data: data?.meta
        })
        field.onChange(data?.meta?.sharing)
    }

    return (
        <>
            <div className="column gap-8">
                <span>{i18n.t('Configure who can access this configuration and metadata associated')}</span>
                <div>
                    <Button loading={loading} disabled={loading} onClick={onOpenSharing}>
                        {i18n.t('Configure sharing')}
                    </Button>
                </div>
            </div>
        </>
    )
}
