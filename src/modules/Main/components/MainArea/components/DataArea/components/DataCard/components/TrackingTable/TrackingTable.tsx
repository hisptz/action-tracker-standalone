import {ActionConfig} from "../../../../../../../../../../shared/schemas/config";
import {TableBody, TableRow} from "@dhis2/ui";
import classes from "../DataTable/DataTable.module.css";
import React from "react";
import {usePageType} from "../../../../../../../../../../shared/hooks";
import {useRecoilValue} from "recoil";
import {TrackingColumnsState} from "../../state/columns";
import {useConfiguration} from "../../../../../../../../../../shared/hooks/config";


export interface TrackingTableProps {
    action: ActionConfig,
    instance: any
}


export function TrackingTable({action, instance}: TrackingTableProps) {
    const {config: mainConfig} = useConfiguration();
    const pageType = usePageType();
    const columns = useRecoilValue(TrackingColumnsState(mainConfig?.id as string));

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
                                    <td className={classes['value-cell']}>
                                        N/A
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
