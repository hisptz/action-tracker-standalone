import { Button, SharingDialog } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useBoolean } from 'usehooks-ts'
import { DATASTORE_NAMESPACE } from '../../../../../shared/constants/meta'
import { useConfiguration } from '../../../../../shared/hooks/config'
import { useDataQuery } from '@dhis2/app-runtime'
import { useController } from 'react-hook-form'
import { type SharingConfig } from '../../../../../shared/schemas/config'

const metaQuery: any = {
    meta: {
        resource: `dataStore/${DATASTORE_NAMESPACE}`,
        id: ({ id }: { id: string }) => `${id}/metaData`
    }
}

const namespace = `general.sharing`

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

    const metaId = data?.meta?.id

    const {
        value: hideSharing,
        setTrue: onHideSharing,
        setFalse: onOpenSharing
    } = useBoolean(true)

    const onClose = async () => {
        onHideSharing()
        await refetch();
        field.onChange(data?.meta?.sharing)
    }

    return (
        <>
            {
                (metaId && !hideSharing)
                    ? (
                        <SharingDialog position={'middle'} onClose={onClose} hide={hideSharing} id={data?.meta?.id}
                                       type="dataStore"/>
                    )
                    : null
            }
            <div>
                <Button loading={loading} disabled={loading} onClick={onOpenSharing}>
                    {i18n.t('Configure sharing')}
                </Button>
            </div>
        </>
    )
}
