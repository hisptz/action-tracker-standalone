import React from 'react'
import { FieldTable } from '../../../../../../shared/components/FieldTable'
import i18n from '@dhis2/d2-i18n'

const namespace = `action`

export function ActionFields () {
    return (
        <div className="column gap-8">
            <b>{i18n.t('Fields')}</b>
            <FieldTable excludeFieldTypes={['FILE_RESOURCE']} actionTable namespace={namespace} type={'attribute'}/>
        </div>
    )
}
