import {ActionConfig} from "../../../../../../../../../../shared/schemas/config";
import {CircularLoader, TableBody, TableRow} from "@dhis2/ui";
import classes from "../DataTable/DataTable.module.css";
import React from "react";
import {useRecoilValue} from "recoil";
import {TrackingColumnsState} from "../../state/columns";
import {useConfiguration} from "../../../../../../../../../../shared/hooks/config";
import {LatestStatus} from "./components/LatestStatus";
import {ActionStatus} from "./components/ActionStatus";
import {useTrackingTableData} from "./hooks/data";


export interface TrackingTableProps {
    actionConfig: ActionConfig,
    instance: any
}


export function TrackingTable({actionConfig, instance}: TrackingTableProps) {
    const {config: mainConfig} = useConfiguration();
    const columns = useRecoilValue(TrackingColumnsState(mainConfig?.id as string));
    const {loading, events, refetch} = useTrackingTableData({instance})

    if (loading) {
        return (
            <div className="w-100">
                <table key={`loading`}>
                    <tbody>
                    <tr>
                        <td colSpan={columns?.length}>
                            <div style={{minHeight: "100px"}} className="column center align-center w-100 h-100">
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
                maxHeight: 500,
                overflowY: "auto"
            }}>
                <table style={{
                    padding: 0,
                    margin: 0,
                    borderSpacing: 0,
                    borderCollapse: "collapse",
                }}>
                    <colgroup>
                        {
                            columns?.map((header,) => (
                                <col width={`${header.width}`} key={`${header.id}-colgroup`}/>))
                        }
                    </colgroup>
                    <TableBody className={classes['table-body']}>
                        <TableRow>
                            {
                                columns.map((column, columnIndex) => (
                                    <td key={`${column.id}-${instance.trackedEntity}-action-status`}
                                        className={classes['value-cell']}>
                                        {
                                            column.id === "latest-status" ? <LatestStatus events={events}/> :
                                                <ActionStatus refetch={refetch} events={events} instance={instance}
                                                              columnConfig={column}/>
                                        }
                                    </td>
                                ))
                            }
                        </TableRow>
                    </TableBody>
                </table>
            </div>
        </div>
    )

}
