import { TableHead, TableRow } from '@dhis2/ui'
import React from 'react'
import classes from './DataTableHead.module.css'
import { useColumns } from '../../../../hooks/columns'

export function DataTableHead () {
    const columns = useColumns()

    return (
        <>
            <colgroup>
                {
                    columns?.map((header, index) => (
                        <col id={header.id} width={`${header.width}px`} key={`${header.id}-colgroup-table-head`}/>))
                }
            </colgroup>
            <TableHead className={classes['header-container']}>
                <TableRow className={classes['header-row']}>
                    {
                        columns?.map((header, index) => (
                            <th style={{ width: `${header.width}px` }} className={classes['header-cell']}
                                key={`${header.id}-table-head`}>{header.name}</th>
                        ))
                    }
                </TableRow>
            </TableHead>
        </>
    )
}
