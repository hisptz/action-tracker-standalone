import React from 'react';
import _ from 'lodash';
import {Card, TableBody, TableHead, TableRow} from '@material-ui/core'
import {CustomNestingTableCell, CustomTable, CustomTableCellHead, CustomTableRowHead} from "./CustomTable";
import GapTable from "./GapTable";
import Bottleneck from "../../../../core/models/bottleneck";
import Gap from "../../../../core/models/gap";
import {useRecoilValue} from "recoil";
import {PageState} from "../../../../core/states";
import {ColumnState, TableState} from "../../../../core/states/column";

export default function ChallengeTable({indicator = new Bottleneck()}) {
    const {visibleColumnsNames, visibleColumnsCount} = useRecoilValue(ColumnState) || {};
    const styles = {
        container: {
            height: '100%',
            maxHeight: 450,
            overflow: 'auto',
            borderRadius: 0
        }
    }

    return (
        <Card variant='outlined' style={styles.container}>
            <CustomTable cellSpacing={0}>
                {
                    <colgroup>
                        {
                            visibleColumnsNames.map(col => <col key={`col${col}`}
                                                                width={`${100 / visibleColumnsCount}%`}/>)
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
