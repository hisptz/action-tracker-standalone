import React from 'react'
import { FieldTable } from '../../../../../../shared/components/FieldTable'
import i18n from '@dhis2/d2-i18n'

const namespace = `action.statusConfig`

export function ActionStatusFields () {
    return (
        <div className="column gap-8 action-status-field-table-container">
            <b>{i18n.t('Fields')}</b>
            <FieldTable namespace={namespace} type={'dataElement'}/>
        </div>
    )
}
