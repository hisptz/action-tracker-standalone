import React from 'react'
import { CustomDataTable } from '@hisptz/dhis2-ui'
import { flattenDeep, head, times } from 'lodash'
import { uid } from '@hisptz/dhis2-utils'
import i18n from '@dhis2/d2-i18n'
import { useDimensions } from '../../../../../../../shared/hooks'
import { DateTime } from 'luxon'
import { useOrgUnit } from '../../../../../../../shared/hooks/orgUnit'
import styles from '../styles/print.css'
import classNames from 'classnames'

export const PDFArea = React.forwardRef<HTMLDivElement, {
    data?: Array<Record<string, any>>
}>(function PDFArea ({ data }, ref) {
    const {
        period,
        orgUnit
    } = useDimensions()
    const { orgUnit: orgUnitWithData } = useOrgUnit(orgUnit?.id)

    if (!data) {
        return null
    }

    const columns = Object.keys(head<Record<string, any>>(data) as unknown as string).map((name) => {
        return {
            key: name,
            label: name
        }
    })

    const rows = flattenDeep(times(40, () => data.map((datum) => ({
        ...datum,
        id: uid()
    }))))

    return (
        <div style={{ display: 'none' }}>
            <div style={{
                padding: 32,
                width: 'fit-content',
                height: 'fit-content'
            }} className={classNames('column gap-8 space-between', styles['print-container'])} ref={ref}>
                <div className="row space-between gap-32">
                    <div className="row gap-8 ">
                    <span>
                      <b>{i18n.t('Organisation unit')}</b>: {orgUnitWithData?.displayName ?? orgUnit.id}
                  </span>
                        <span>
                      <b>{i18n.t('Period')}</b>: {period?.name}
                  </span>
                    </div>
                </div>
                <div className="flex-1" style={{ display: 'block' }}>
                    <CustomDataTable columns={columns} rows={rows}/>
                </div>
                <div className="row end">
                 <span>
                    {i18n.t('Generated at')}: <i>{DateTime.now().toFormat('yyyy-MM-dd hh:mm')}</i>
                </span>
                </div>
            </div>
        </div>
    )
})
