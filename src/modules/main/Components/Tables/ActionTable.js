import {CustomNestedTable, CustomTableCell, DueDateTableCell, StatusTableCell} from "./CustomTable";
import {duration, TableBody, TableRow} from "@material-ui/core";
import _ from "lodash";
import React from "react";


export default function ActionTable({actions}){

    return(
        <div
            style={{height: 200, overflow: 'auto'}}>
            <CustomNestedTable>
                <colgroup>
                    <col width='15%'/>
                    <col width='15%'/>
                    <col width='12%'/>
                    <col width='12%'/>
                    <col width='14%'/>
                </colgroup>
                <TableBody>
                    {
                        _.map(actions, ({
                                            description,
                                            responsiblePerson,
                                            designation,
                                            startDate,
                                            endDate,
                                            status
                                        }) =>
                            <TableRow>
                                <CustomTableCell>
                                    {description}
                                </CustomTableCell>
                                <CustomTableCell>
                                    {responsiblePerson}, {designation}
                                </CustomTableCell>
                                <CustomTableCell>
                                    {startDate}
                                </CustomTableCell>
                                <DueDateTableCell dueDate={endDate} />
                                <StatusTableCell status={status} />
                            </TableRow>)
                    }
                </TableBody>
            </CustomNestedTable>
        </div>
    )
}
