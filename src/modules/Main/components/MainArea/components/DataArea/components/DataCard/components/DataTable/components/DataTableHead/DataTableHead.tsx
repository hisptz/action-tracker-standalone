import {TableCellHead, TableHead, TableRow} from "@dhis2/ui";
import React from "react";
import classes from "./DataTableHead.module.css"
import {useColumns} from "../../../../hooks/columns";

export function DataTableHead() {
    const columns = useColumns();

    return (
        <>
            <colgroup>
                {
                    columns?.map((header, index) => (
                        <col id={header.id} width={`${header.width}px`} key={`${header.id}-colgroup-table-head`}/>))
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
