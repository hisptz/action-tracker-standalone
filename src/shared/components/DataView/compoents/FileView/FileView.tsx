import { Button, IconDownload24 } from '@dhis2/ui'
import React from 'react'
import i18n from '@dhis2/d2-i18n'
import { useDownload } from './hooks/download'
import { Event, TrackedEntity } from '../../../../types/dhis2'
import { DataField } from '../../../../schemas/config'

export interface FileViewProps {
    type: 'program' | 'programStage',
    instance: TrackedEntity | Event,
    field: DataField,
    small?: boolean;
}

export function FileView ({
                              type,
                              instance,
                              field,
                              small
                          }: FileViewProps) {
    const {
        downloading,
        download
    } = useDownload(type)

    const onDownload = async () => {
        await download({
            instance: type === 'program' ? (instance as TrackedEntity).trackedEntity : (instance as Event).event,
            dataElement: type === 'program' ? undefined : field.id,
            trackedEntityAttribute: type === 'program' ? field.id : undefined
        })
    }

    return (
        <Button small={small} onClick={onDownload} icon={<IconDownload24/>} loading={downloading}>
            {downloading ? i18n.t('Downloading...') : i18n.t('Download')}
        </Button>

    )
}
