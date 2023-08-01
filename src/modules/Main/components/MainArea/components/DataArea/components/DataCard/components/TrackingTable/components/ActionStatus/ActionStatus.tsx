import { ActionTrackingColumnStateConfig } from '../../../../state/columns'
import React, { Fragment, useMemo } from 'react'
import { useDimensions } from '../../../../../../../../../../../../shared/hooks'
import { find, get } from 'lodash'
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

export interface ActionStatusProps {
    refetch: () => void;
    instance: any,
    events: any[]
    columnConfig: ActionTrackingColumnStateConfig
}

export function ActionStatus ({
                                  instance,
                                  columnConfig,
                                  events,
                                  refetch
                              }: ActionStatusProps) {
    const {
        value: hide,
        setTrue: onHide,
        setFalse: onShow
    } = useBoolean(true)
    const { confirm } = useConfirmDialog()
    const { period: selectedPeriod } = useDimensions()
    const { config } = useConfiguration()
    const { period } = columnConfig
    const statusEvent = useMemo(() => {
        if (!events) return null
        return find(events, (event) => {
            const date = new Date(event.occurredAt)
            return period.interval.contains(DateTime.fromJSDate(date))
        }) as any ?? null
    }, [instance, period, events])
    const onActionManageComplete = () => {
        refetch()
    }
    const { onDelete: onDeleteConfirm } = useManageActionStatus({
        instance,
        onComplete: onActionManageComplete,
        defaultValue: statusEvent
    })
    const tableData = useMemo(() => {
        if (!statusEvent) return null
        const dataValues = get(statusEvent, ['dataValues'], null)
        const data = dataValues.map((dataValue: { dataElement: string; value: string }) => {
            const dataElement = find(config?.action.statusConfig.fields, { id: dataValue.dataElement })
            return {
                name: dataElement?.name,
                value: dataValue.value
            }
        })

        return [
            {
                name: i18n.t('Review Date'),
                value: DateTime.fromISO(statusEvent.occurredAt).toFormat('dd-MM-yyyy')
            },
            ...data
        ]

    }, [statusEvent,])

    //TODO: Discuss if this is how it should be...
    if (!selectedPeriod?.interval.engulfs(period.interval)) {
        return null
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
            <TableCell className={classes['tracking-value-cell']}>
                <ActionStatusForm onComplete={onActionManageComplete} columnConfig={columnConfig} onClose={onHide}
                                  hide={hide} instance={instance}/>
                <div className="w-100 h-100 column center align-center">
                    <Button onClick={onShow} icon={<IconAdd24/>}/>
                </div>
            </TableCell>
        )
    }

    return (
        <TableCell className={classes['tracking-value-cell']}>
            <ActionStatusForm defaultValue={statusEvent} onComplete={onActionManageComplete} columnConfig={columnConfig}
                              onClose={onHide}
                              hide={hide} instance={instance}/>
            <div className="w-100 h-100 row gap-8">
                <div className="flex-1 column gap-8">
                    {
                        tableData?.map((dataValue: any) => (
                            <Fragment key={dataValue.name}>
                                <b className="m-0">{dataValue.name}</b>
                                <span className="m-0">{dataValue.value}</span>
                            </Fragment>
                        ))
                    }
                </div>
                <div>
                    <ActionButton
                        onEdit={onShow}
                        onDelete={onDelete}
                    />
                </div>
            </div>
        </TableCell>
    )
}
