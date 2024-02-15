import { TableHead, TableRow } from '@dhis2/ui'
import React from 'react'
import classes from './DataTableHead.module.css'
import { useColumns } from '../../../../hooks/columns'

export function DataTableHead () {
    const columns = useColumns()

    return (
        <>
            <TableHead className={classes['header-container']}>

                <TableRow className={classes['header-row']}>
                    {
                        columns?.map((header, index) => (
                            <th
                                className={classes['header-cell']}
                                key={`${header.id}-table-head`}>{header.name}</th>
                        ))
                    }
                </TableRow>
            </TableHead>
        </>
    )
}
