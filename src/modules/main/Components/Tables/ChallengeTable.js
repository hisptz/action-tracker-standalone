import React from 'react';
import _ from 'lodash';
import {Card, TableBody, TableHead, TableRow} from '@material-ui/core'
import {CustomNestingTableCell, CustomTable, CustomTableCellHead, CustomTableRowHead} from "./CustomTable";
import GapTable from "./GapTable";
import Bottleneck from "../../../../core/models/bottleneck";
import Gap from "../../../../core/models/gap";
import {useRecoilValue} from "recoil";
import {PageState} from "../../../../core/states";

export default function ChallengeTable({indicator = new Bottleneck()}) {
    const activePage = useRecoilValue(PageState);
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
                {
                    <colgroup>
                        {
                            [1,2,3,4,5,6,7].map(_ => <col width={`${100 / 7}%`}/>)
                        }
                    </colgroup>
                }
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
