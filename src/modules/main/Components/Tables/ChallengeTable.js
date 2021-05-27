import React from 'react';
import _ from 'lodash';
import {Card, TableBody, TableHead, TableRow} from '@material-ui/core'
import {CustomNestingTableCell, CustomTable, CustomTableCellHead, CustomTableRowHead} from "./CustomTable";
import GapTable from "./GapTable";
import Bottleneck from "../../../../core/models/bottleneck";
import {useRecoilValue} from "recoil";
import {TableStateSelector} from "../../../../core/states/column";

export default function ChallengeTable({indicator = new Bottleneck()}) {
    const {visibleColumnsNames, visibleColumnsCount} = useRecoilValue(TableStateSelector) || {};
    const styles = {
        container: {

            borderRadius: 0,
            maxWidth: '100%',
            overflowX: 'auto'
        }
    }

    return (
        <Card variant='outlined' style={styles.container}>
            <CustomTable cellSpacing={0} >
                {
                    <colgroup>
                        {
                            _.map(visibleColumnsNames, col => <col key={`col${col}`} width={`${100 / visibleColumnsCount}%`}/>)
                        }
                    </colgroup>
                }
                <TableHead>
                    <CustomTableRowHead>
                        {
                            _.map(visibleColumnsNames, (column) => column && <CustomTableCellHead
                                key={`${column}-${indicator.id}-header`}>{column}</CustomTableCellHead>)
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
