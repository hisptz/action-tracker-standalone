import React from 'react'
import { Button, ButtonStrip } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import { useDataQuery } from '@dhis2/app-runtime'

const query = {
    orgUnits: {
        resource: 'organisationUnits',
        params: {
            fields: [
                'id',
                'path'
            ],
            paging: false
        }
    }
}

export function AllSelector ({ field }: {
    field: { value: Array<{ id: string }>, onChange: (value: Array<{ id: string }>) => void }
}) {
    const {
        refetch,
        loading
    } = useDataQuery<{ orgUnits: { organisationUnits: Array<{ id: string }> } }>(query, { lazy: true })

    const onSelectAll = async () => {
        const allOrgUnits = await refetch() as { orgUnits: { organisationUnits: Array<{ id: string }> } }
        field.onChange(allOrgUnits.orgUnits.organisationUnits)
    }
    const onSelectAllClick = () => {
        onSelectAll().catch(console.error)
    }

    const onDeselectAll = () => {
        field.onChange([])
    }

    return (
        <ButtonStrip>
            <Button loading={loading} onClick={onSelectAllClick}>{i18n.t('Select all')}</Button>
            <Button onClick={onDeselectAll}>{i18n.t('Deselect all')}</Button>
        </ButtonStrip>
    )
}
