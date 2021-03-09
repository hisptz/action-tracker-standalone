import React from 'react';
import _ from 'lodash';
import styles from '../styles/indicators.module.css'
import {Table, TableCell, TableHead, TableBody, TableRow, Card, withStyles} from '@material-ui/core'
// import {
//     Table,
//     TableBody,
//     TableCellHead,
//     TableFoot,
//     TableHead,
//     TableRow,
//     TableRowHead,
//     TableCell
// } from '@dhis2/ui'


const StyledTableRowHead = withStyles((theme) => ({
    root: {
        padding: 4,
        backgroundColor: '#F8F9FA'
    }
}))(TableRow)

const StyledTableCellHead = withStyles((theme) => ({
    root: {
        paddingTop: 5,
        paddingBottom: 5,
        width: 'auto'
    }
}))(TableCell)

const StyledTableCell = withStyles((theme) => ({
    root: {
        verticalAlign: 'top',
        paddingBottom: 5
    }
}))(TableCell)

const StyledTable = withStyles((theme) => ({
    root: {
        overflowY: 'scroll',
        height: 500,
        maxHeight: 200,
    }
}))(Table)


export default function IndicatorTable({indicator}) {
    const {gaps} = indicator;

    const columns = [
        'Gap',
        'Possible Solutions',
        'Action Items',
        'Responsible Person & Designation',
        'StartDate',
        'Due Date',
        'Status'
    ]

    return (
        <StyledTable cellSpacing={0} component={Card} variant='outlined'>
            <TableHead>
                <StyledTableRowHead>
                    <StyledTableCellHead>Gap</StyledTableCellHead>
                    <StyledTableCellHead>Possible Solution</StyledTableCellHead>
                    <StyledTableCellHead>Action Items</StyledTableCellHead>
                    <StyledTableCellHead>Responsible Person & Designation</StyledTableCellHead>
                    <StyledTableCellHead>Start Date</StyledTableCellHead>
                    <StyledTableCellHead>Due Date</StyledTableCellHead>
                    <StyledTableCellHead>Status</StyledTableCellHead>
                </StyledTableRowHead>
            </TableHead>
            <TableBody>
                {
                    _.map(gaps, ({description, solutions}) => <TableRow>
                        <StyledTableCell width={200}>
                            {description}
                        </StyledTableCell>
                        <StyledTableCell colSpan={6} style={{padding: 0}} >
                            <div style={{height: 450, overflow: 'auto'}}  >
                                <Table >
                                    <TableBody>
                                        {
                                            _.map(solutions, ({solution, actions}) => <TableRow>
                                                <StyledTableCell>
                                                    {solution}
                                                </StyledTableCell>
                                                <StyledTableCell colSpan={6} style={{padding: 0}}>
                                                    <div style={{height: 300, overflow: 'auto'}} >
                                                        <Table>
                                                            <TableBody>
                                                                {
                                                                    _.map(actions, ({
                                                                                        description,
                                                                                        responsiblePerson,
                                                                                        designation,
                                                                                        startDate,
                                                                                        endDate,
                                                                                        status
                                                                                    }) =>
                                                                        <TableRow>
                                                                            <StyledTableCell width={200}>
                                                                                {description}
                                                                            </StyledTableCell>
                                                                            <StyledTableCell width={300}>
                                                                                {responsiblePerson}, {designation}
                                                                            </StyledTableCell>
                                                                            <StyledTableCell width={100}>
                                                                                {startDate}
                                                                            </StyledTableCell>
                                                                            <StyledTableCell width={100}>
                                                                                {endDate}
                                                                            </StyledTableCell>
                                                                            <StyledTableCell width={100}>
                                                                                {status}
                                                                            </StyledTableCell>
                                                                        </TableRow>)
                                                                }
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                </StyledTableCell>
                                            </TableRow>)
                                        }
                                    </TableBody>
                                </Table>
                            </div>
                        </StyledTableCell>
                    </TableRow>)
                }
            </TableBody>
        </StyledTable>
    )
}
