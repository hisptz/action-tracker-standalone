import {TableCellHead, TableHead, TableRow} from "@dhis2/ui";
import React from "react";
import {useConfiguration} from "../../../../../../../../../../../../shared/hooks/config";
import classes from "./DataTableHead.module.css"
import {useRecoilValue} from "recoil";
import {ColumnState} from "../../../../state/columns";

export function DataTableHead() {
    const {config} = useConfiguration()
    const columns = useRecoilValue(ColumnState(config?.id as string))

    return (
        <>
            <colgroup>
                {
                    columns?.map((header, index) => (
                        <col width={`${100 / columns.length}%`} key={`${header.id}-colgroup`}/>))
                }
            </colgroup>
            <TableHead>
                <TableRow className={classes['header-row']}>
                    {
                        columns?.map((header, index) => (
                            <TableCellHead className={classes['header-cell']}
                                           key={`${header.id}-table-head`}>{header.name}</TableCellHead>
                        ))
                    }
                </TableRow>
            </TableHead>
        </>
    )
}
