import { ActionConfig } from '../../../../../../../../../../shared/schemas/config'
import { CircularLoader } from '@dhis2/ui'
import classes from '../DataTable/DataTable.module.css'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { TrackingColumnsState } from '../../state/columns'
import { useConfiguration } from '../../../../../../../../../../shared/hooks/config'
import { LatestStatus } from './components/LatestStatus'
import { ActionStatus } from './components/ActionStatus'
import { useTrackingTableData } from './hooks/data'
import { useTableColumns } from '../DataTable/hooks/columns'

export interface TrackingTableProps {
    actionConfig: ActionConfig,
    instance: any
}

export function TrackingTable ({
                                   actionConfig,
                                   instance
                               }: TrackingTableProps) {
    const { config: mainConfig } = useConfiguration()
    const columns = useRecoilValue(TrackingColumnsState(mainConfig?.id as string))
    const {
        loading,
        events,
        refetch
    } = useTrackingTableData({ instance })
    const { allColumns } = useTableColumns()

    if (loading) {
        return (
            <div className="w-100 h-100">
                <table key={`loading`}>
                    <tbody>
                    <tr>
                        <td colSpan={columns?.length}>
                            <div style={{ minHeight: '100px' }} className="column center align-center w-100 h-100">
                                <CircularLoader small/>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        )
    }
    return (
        <div className="column w-100">
            <div style={{
                maxHeight: 520,
                overflowY: 'auto'
            }}>
                <table style={{
                    tableLayout: 'fixed',
                    padding: 0,
                    margin: 0,
                    borderSpacing: 0,
                    borderCollapse: 'collapse',
                    width: '100%',
                    height: '100%'
                }}>
                    <tbody className={classes['table-body']}>
                    <tr>
                            {
                                columns.map((column, columnIndex) => (
                                    column.id === 'latest-status' ?
                                        <LatestStatus key={`${column.id}-${instance.trackedEntity}-action-status`}
                                                      events={events}/> :
                                        <ActionStatus
                                            columns={columns}
                                            allColumns={allColumns}
                                            key={`${column.id}-${instance.trackedEntity}-action-status`}
                                            refetch={refetch}
                                            events={events}
                                            instance={instance}
                                            columnConfig={column}
                                        />
                                ))
                            }
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )

}
