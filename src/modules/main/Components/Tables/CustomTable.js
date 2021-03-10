import {Card, Grid, Paper, Table, TableCell, TableFooter, TableRow, withStyles} from "@material-ui/core";
import DueDateWarningIcon from '@material-ui/icons/ReportProblemOutlined';

const CustomTableRowHead = withStyles((theme) => ({
    root: {
        padding: 4,
        backgroundColor: '#F8F9FA',

    }
}))(TableRow)

const CustomTableCellHead = withStyles((theme) => ({
    root: {
        paddingTop: 5,
        paddingBottom: 5,
        fontSize: 14,
        color: '#212934'
    }
}))(TableCell)

const CustomTableCell = withStyles((theme) => ({
    root: {
        verticalAlign: 'top',
        paddingBottom: 5,
        fontSize: 14
    }
}))(TableCell)
const CustomNestingTableCell = withStyles((theme) => ({
    root: {
        verticalAlign: 'top',
        padding: 0,

    }
}))(TableCell)

const CustomTable = withStyles((theme) => ({
    root: {
        overflowY: 'scroll',
        height: 500,
        maxHeight: 200,
    }
}))(Table)

const CustomNestedTable = withStyles((theme) => ({
    root: {
        padding: 0,
        margin: 0,
        scrollMargin: '1rem'
    }
}))(Table)

const CustomTableFooter = withStyles((theme) => ({
    root: {
        left: 0,
        bottom: 0,
        position: 'sticky'
    }
}))(TableFooter)

const StyledStatusTableCell = withStyles((theme) => ({
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
            status: 'In Progress',
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
            <StatusContainer status={status}/>
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
