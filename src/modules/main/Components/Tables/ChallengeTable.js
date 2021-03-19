import React from 'react';
import _ from 'lodash';
import {Card, TableBody, TableHead, TableRow} from '@material-ui/core'
import {CustomNestingTableCell, CustomTable, CustomTableCellHead, CustomTableRowHead} from "./CustomTable";
import GapTable from "./GapTable";
import Bottleneck from "../../../../core/models/bottleneck";
import Gap from "../../../../core/models/gap";
import {useRecoilValue} from "recoil";
import {PageState} from "../../../../core/states";
import {LiveColumnState} from "../../../../core/states/column";

export default function ChallengeTable({indicator = new Bottleneck()}) {
    const {columns, visibleColumnsCount} = useRecoilValue(LiveColumnState) || {};
    return (
        <Card variant='outlined'>
            <CustomTable cellSpacing={0}>
                {
                    <colgroup>
                        {
                            columns.map(col => <col key={`col${col.name}`} width={`${100 /visibleColumnsCount }%`}/>)
                        }
                    </colgroup>
                }
                <TableHead>
                    <CustomTableRowHead>
                        {
                            _.map(columns, (column) => column.visible && <CustomTableCellHead
                                key={`${column?.name}-${indicator.id}-header`}>{column?.displayName}</CustomTableCellHead>)
                        }
                    </CustomTableRowHead>
                </TableHead>
                <TableBody>
                    <TableRow key={`${indicator.id}-row`}>
                        <CustomNestingTableCell key={`${indicator.id}-cell`} colSpan={visibleColumnsCount}>
                            <GapTable challenge={indicator}/>
                        </CustomNestingTableCell>
                    </TableRow>
                </TableBody>
            </CustomTable>
        </Card>
    )
}
