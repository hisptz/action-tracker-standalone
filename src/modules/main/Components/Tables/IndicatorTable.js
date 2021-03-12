import React from 'react';
import _ from 'lodash';
import {Card, TableBody, TableFooter, TableHead, TableRow} from '@material-ui/core'
import {Button} from '@dhis2/ui'
import {
    CustomNestingTableCell,
    CustomTable,
    CustomTableCellHead,
    CustomTableRowHead
} from "./CustomTable";
import GapTable from "./GapTable";
import Indicator from "../../../../core/models/indicator";


export default function IndicatorTable({indicator= new Indicator()}) {
    const {gaps} = indicator

    console.log(indicator);

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
                            _.map(columns, (column)=> <CustomTableCellHead>{column}</CustomTableCellHead>)
                        }
                    </CustomTableRowHead>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <CustomNestingTableCell colSpan={7}>
                           <GapTable gaps={gaps} />
                        </CustomNestingTableCell>
                    </TableRow>
                </TableBody>
                <TableFooter>
                    <div style={{padding: 5}}>
                        <Button>Add Gap</Button>
                    </div>
                </TableFooter>
            </CustomTable>
        </Card>
    )
}
