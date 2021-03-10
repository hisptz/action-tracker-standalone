import {Table, TableCell, TableFooter, TableRow, withStyles} from "@material-ui/core";


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
        margin: 0
    }
}))(Table)

const CustomTableFooter = withStyles((theme) => ({
    root: {
        left: 0,
        bottom: 0,
        position: 'sticky'
    }
}))(TableFooter)

const StatusTableCell = withStyles((theme)=>({
    root:{
        background: '#c8e6c9'
    }
}))(TableCell)

const DueDateTableCell = withStyles((theme)=>({
    root:{
        background: '#ffecb3'
    }
}))(TableCell)

export {
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
