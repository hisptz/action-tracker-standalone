import React from 'react';
import _ from 'lodash';
import {Card, TableBody, TableHead, TableRow} from '@material-ui/core'
import {CustomNestingTableCell, CustomTable, CustomTableCellHead, CustomTableRowHead} from "./CustomTable";
import GapTable from "./GapTable";
import Bottleneck from "../../../../core/models/bottleneck";
import Gap from "../../../../core/models/gap";

export default function ChallengeTable({indicator = new Bottleneck()}) {
    const columns = [
        'Gap',
        'Possible Solutions',
        'Action Items',
        'Responsible Person & Designation',
        'StartDate',
        'Due Date',
        'Status'
    ];

    return (
        <Card variant='outlined'>
            <CustomTable cellSpacing={0}>
                <colgroup>
                    <col width='15%'/>
                    <col width='15%'/>
                    <col width='15%'/>
                    <col width='15%'/>
                    <col width='12%'/>
                    <col width='12%'/>
                    <col width='16%'/>
                </colgroup>
                <TableHead>
                    <CustomTableRowHead>
                        {
                            _.map(columns, (column) => <CustomTableCellHead>{column}</CustomTableCellHead>)
                        }
                    </CustomTableRowHead>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <CustomNestingTableCell colSpan={7}>
                            <GapTable challenge={indicator}/>
                        </CustomNestingTableCell>
                    </TableRow>
                </TableBody>
            </CustomTable>
        </Card>
    )
}
