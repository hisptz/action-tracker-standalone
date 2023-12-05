import { ActionTrackingColumnStateConfig, ColumnStateConfig } from '../../../../state/columns'
import React, { Fragment, useMemo } from 'react'
import { useDimensions } from '../../../../../../../../../../../../shared/hooks'
import { compact, find, get } from 'lodash'
import { DateTime } from 'luxon'
import { Button, IconAdd24, TableCell } from '@dhis2/ui'
import { useBoolean } from 'usehooks-ts'
import { ActionStatusForm } from './components/ActionStatusForm'
import { useConfiguration } from '../../../../../../../../../../../../shared/hooks/config'
import i18n from '@dhis2/d2-i18n'
import { ActionButton } from '../../../../../../../../../../../../shared/components/ActionButton'
import { useConfirmDialog } from '@hisptz/dhis2-ui'
import { useManageActionStatus } from './components/ActionStatusForm/hooks/save'
import classes from '../../../DataTable/DataTable.module.css'
import { hexToRgba } from '../LatestStatus'
import { useMetadata } from '../../../../../../../../../../../../shared/hooks/metadata'
import { useViewModal } from '../../../../../../../../../../../../shared/components/ViewModal'
import { ActionStatusConfig } from '../../../../../../../../../../../../shared/schemas/config'
import { DataView } from '../../../../../../../../../../../../shared/components/DataView/DataView'
import { AccessProvider } from '../../../../../../../../../../../../shared/components/AccessProvider'
import { useAccess } from '../../../../../../../../../../../../shared/components/AccessProvider/hooks/access'
import { formatDate } from '../../../../../../../../../../../../shared/utils/date'
import { TrackedEntity } from '../../../../../../../../../../../../shared/types/dhis2'
import { useShowActionTracking } from './hooks/date'

export interface ActionStatusProps {
    refetch: () => void;
    action: TrackedEntity,
    events: any[]
    columnConfig: ActionTrackingColumnStateConfig,
    columns: ColumnStateConfig[],
    allColumns: ColumnStateConfig[]
}

export function ActionStatus ({
                                  action,
                                  columnConfig,
                                  events,
                                  refetch,
                                  allColumns,
                                  columns
                              }: ActionStatusProps) {
    const {
        value: hide,
        setTrue: onHide,
        setFalse: onShow
    } = useBoolean(true)
    const { confirm } = useConfirmDialog()
    const allowed = useAccess('Standalone Action Tracker - Tracking')

    const { show } = useViewModal()
    const { period: selectedPeriod } = useDimensions()
    const { config } = useConfiguration()
    const { period } = columnConfig
    const statusEvent = useMemo(() => {
        if (!events) return null
        return find(events, (event) => {
            const date = new Date(event.occurredAt)
            return period.interval.contains(DateTime.fromJSDate(date))
        }) as any ?? null
    }, [action, period, events])
    const onActionManageComplete = () => {
        refetch()
    }
    const { onDelete: onDeleteConfirm } = useManageActionStatus({
        action: action,
        onComplete: onActionManageComplete,
        defaultValue: statusEvent,
        columnConfig
    })

    const { status: statusOptionSet } = useMetadata()
    const actionStatusConfig = config?.action.statusConfig

    const options = statusOptionSet?.options || []
    const tableData = useMemo(() => {
        if (!statusEvent) return null
        const dataValues = get(statusEvent, ['dataValues'], [])
        const data = compact(dataValues.map((dataValue: { dataElement: string; value: string }) => {
            const dataElement = find(config?.action.statusConfig.fields, { id: dataValue.dataElement })
            if (!dataElement?.showAsColumn) {
                return
            }

            if (dataValue.dataElement === actionStatusConfig?.stateConfig?.dataElement) {
                return {
                    name: dataElement?.name,
                    value: find(options, ['code', dataValue?.value])?.name
                }
            }

            return {
                id: dataElement.id,
                name: dataElement?.name,
                value: dataValue.value
            }
        }))

        return [
            {
                name: i18n.t('Review Date'),
                value: formatDate(statusEvent.occurredAt),
            },
            ...data
        ]

    }, [statusEvent])

    const showActionStatus = useShowActionTracking({
        action,
        period
    })

    if (!showActionStatus) {
        return <TableCell className={classes['tracking-value-cell']}/>
    }

    //TODO: Discuss if this is how it should be...
    if (period.start.diffNow('days').days > 0 && !selectedPeriod?.interval.engulfs(period.interval)) {
        return <TableCell className={classes['tracking-value-cell']}/>
    }
    const onDelete = () => {
        confirm({
            title: i18n.t('Confirm delete'),
            onConfirm: async () => {
                await onDeleteConfirm()
                refetch()
            },
            message: i18n.t('Are you sure you want to delete this status?'),
            onCancel: () => {
            }
        })
    }

    if (!statusEvent) {
        return (
            <td style={{ width: 'auto' }}
                className={classes['tracking-value-cell']}>
                <ActionStatusForm
                    onComplete={onActionManageComplete}
                    columnConfig={columnConfig}
                    onClose={onHide}
                    hide={hide}
                    action={action}
                />
                <div className="w-100 h-100 column center align-center">
                    <AccessProvider access="Standalone Action Tracker - Tracking">
                        <Button onClick={onShow} icon={<IconAdd24/>}/>
                    </AccessProvider>
                </div>
            </td>
        )
    }
    const status = find(statusEvent.dataValues, ['dataElement', actionStatusConfig?.stateConfig?.dataElement])?.value

    const selectedOption = find(options, ['code', status])

    const color = selectedOption?.style.color ?? '#FFFFFF'

    return (
        <td style={{
            background: hexToRgba(color, .4) ?? 'transparent',
            width: 'auto'
        }}
            className={classes['tracking-value-cell']}>
            <ActionStatusForm
                action={action}
                defaultValue={statusEvent}
                onComplete={onActionManageComplete}
                columnConfig={columnConfig}
                onClose={onHide}
                hide={hide}
            />
            <div className="w-100 h-100 row gap-8">
                <div className="flex-1 column gap-8">
                    {
                        tableData?.map((dataValue: any) => (
                            <Fragment key={dataValue.name}>
                                <b className="m-0">{dataValue.name}</b>
                                <span className="m-0">
                                    <DataView
                                        small
                                        instance={statusEvent} value={dataValue.value}
                                        instanceConfig={actionStatusConfig as ActionStatusConfig}
                                        fieldId={dataValue.id}
                                    />
                                </span>
                            </Fragment>
                        ))
                    }
                </div>
                <div>
                    <ActionButton
                        onView={() => {
                            show({
                                instance: statusEvent,
                                instanceConfig: actionStatusConfig as ActionStatusConfig
                            })
                        }}
                        onEdit={allowed ? onShow : undefined}
                        onDelete={allowed ? onDelete : undefined}
                    />
                </div>
            </div>
        </td>
    )
}
