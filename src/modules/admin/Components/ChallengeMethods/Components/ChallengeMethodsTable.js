import {
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableFoot,
    TableHead,
    TableRow,
    TableRowHead,
    Button,
    Pagination
} from '@dhis2/ui';
import _ from 'lodash';
import SettingsIcon from '@material-ui/icons/Settings';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'


import React from 'react';


const columns = [
    'Name',
    'Code',
    <SettingsIcon/>
]

const rows = [
    {
        name: 'Not Started',
        code: 'Not Started',
    },
    {
        name: 'Not Started',
        code: 'Not Started',
    },

]

export default function ChallengeMethodsTable() {
    return (
        <Table>
            <TableHead>
                <TableRowHead>
                    {
                        _.map(columns, (column) => <TableCellHead
                            key={`${column}-action-status`}>{column}</TableCellHead>)
                    }
                </TableRowHead>
            </TableHead>
            <TableBody>
                {
                    _.map(rows, ({name, code}) => (
                        <TableRow key={`${code}-row`}>
                            <TableCell>{name}</TableCell>
                            <TableCell>{code}</TableCell>
                            <TableCell><Button icon={<MoreHorizIcon/>}/></TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
            <TableFoot>
                <TableRow >
                    <TableCell colSpan={columns.length.toString()}>
                        <Pagination
                            onPageChange={_ => {
                            }}
                            onPageSizeChange={_ => {
                            }}
                            page={10}
                            pageCount={21}
                            pageSize={50}
                            total={1035}
                        />
                    </TableCell>
                </TableRow>
            </TableFoot>
        </Table>
    )
}
