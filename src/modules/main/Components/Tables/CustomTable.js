import {Card, Grid, Table, TableCell, TableFooter, TableRow, withStyles} from "@material-ui/core";
import {Button} from '@dhis2/ui'
import DueDateWarningIcon from '@material-ui/icons/ReportProblemOutlined';
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import React from "react";

const CustomTableRowHead = withStyles((_) => ({
    root: {
        padding: 4,
        backgroundColor: '#F8F9FA',

    }
}))(TableRow)

const CustomTableCellHead = withStyles((_) => ({
    root: {
        paddingTop: 5,
        paddingBottom: 5,
        fontSize: 14,
        color: '#212934'
    }
}))(TableCell)

const CustomTableCell = withStyles((_) => ({
    root: {
        verticalAlign: 'top',
        paddingBottom: 5,
        fontSize: 14
    }
}))(TableCell)
const CustomNestingTableCell = withStyles((_) => ({
    root: {
        verticalAlign: 'top',
        padding: 0,

    }
}))(TableCell)

const CustomTable = withStyles((_) => ({
    '@global': {
        '*::-webkit-scrollbar': {
            width: '0.3em'
        },
        '*::-webkit-scrollbar-track': {
            '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#D5DDE5',
            outline: '0.5px solid #E8EDF2'
        }
    },
    root: {
        overflowY: 'auto',
        height: 500,
        maxHeight: 200,

    }
}))(Table)

const CustomNestedTable = withStyles((_) => ({
    root: {
        height: '100%',
        padding: 0,
        margin: 0,
        scrollMargin: '1rem'
    }
}))(Table)

const CustomTableFooter = withStyles((_) => ({
    root: {
        left: 0,
        bottom: 0,
        position: 'sticky'
    }
}))(TableFooter)

const StyledStatusTableCell = withStyles((_) => ({
    root: {
        verticalAlign: 'top',
        paddingBottom: 5,
        fontSize: 14
    }
}))(TableCell)

const StatusContainer = ({status}) => {
    //TODO:Call the legend configs
    const legend = [
        {
            status: 'In progress',
            color: '#c8e6c9',
            textColor: '#103713',
            icon: ''
        },
        {
            status: 'Open',
            color: '#c5e3fc',
            textColor: '#093371',
            icon: ''
        },

    ];

    const {status: selectedStatus, color, textColor} = _.find(legend, ['status', status]) || {status, color: '#d8d8d8'};
    return <Card variant='outlined' component='p' style={{
        background: color,
        textAlign: 'center',
        padding: 3,
        marginRight: '30%',
        color: textColor
    }}>{selectedStatus}</Card>
}

const StatusTableCell = ({status}) => {
    return (
        <StyledStatusTableCell>
            <Grid item container direction='row' justify='space-between' spacing={2}>
                <Grid item xs={9} >
                    <StatusContainer status={status}/>
                </Grid>
                <Grid container justify='center' alignItems='center' item xs={3}>
                    <Button icon={<MoreHorizIcon/>} />
                </Grid>
            </Grid>
        </StyledStatusTableCell>
    )
}


const DueDateTableCell = ({dueDate}) => {
    const warning = false;
    return (
        <CustomTableCell style={{
            background: warning && '#ffecb3'
        }}>
            <Grid container direction='row' spacing={1}>
                {
                    warning &&
                    <Grid item>
                        <DueDateWarningIcon fontSize='small' style={{color: warning && '#6f3205'}}/>
                    </Grid>
                }
                <Grid item>
                    <span style={{color: warning && '#6f3205'}}>{dueDate}</span>
                </Grid>
            </Grid>
        </CustomTableCell>
    )
}

export
{
    CustomNestedTable,
    CustomTableCell,
    CustomTableRowHead,
    CustomTable,
    CustomTableCellHead,
    CustomNestingTableCell,
    CustomTableFooter,
    StatusTableCell,
    DueDateTableCell
}
