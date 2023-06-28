import React from "react";
import {Table, TableBody, TableCell, TableRow} from "@dhis2/ui";
import classNames from "classnames";
import classes from "./CustomTable.module.css";

export interface CustomTableProps {
    nested: boolean;
}

export function CustomTable({nested}: CustomTableProps) {


    return (
        <Table className={classNames(`${classes['table']}`, {
            [classes['nested']]: nested,
        })}>
            <TableBody>
                <TableRow>
                    <TableCell></TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}
