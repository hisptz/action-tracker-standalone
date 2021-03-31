import {
    Card,
    Grid,
    IconButton,
    Table,
    TableCell,
    TableFooter,
    TableRow,
    withStyles
} from "@material-ui/core";
import {Button, CenteredContent} from '@dhis2/ui'
import DueDateWarningIcon from '@material-ui/icons/ReportProblemOutlined';
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import React, {useEffect, useState, useRef} from "react";
import {ActionConstants} from "../../../../core/constants/action";
import AddIcon from '@material-ui/icons/Add';
import ActionStatusDialog from "../../../../shared/Dialogs/ActionStatusDialog";
import TableActionsMenu from "../TableActionsMenu";
import {ActionStatusState} from "../../../../core/states";
import {useRecoilValue} from "recoil";
import _ from 'lodash';
import {generateTextColor} from "../../../../core/helpers/utils";
import {formatSvg} from "../../../../core/services/utils";

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
        color: '#212934',
        fontWeight: 'normal'
    }
}))(TableCell)

const CustomTableCell = withStyles((_) => ({
    root: {
        verticalAlign: 'top',
        paddingBottom: 5,
        paddingTop: 10,
        fontSize: 14,
    }
}))(TableCell)
const CustomNestingTableCell = withStyles((_) => ({
    root: {
        padding: 0,
    }
}))(TableCell)

const CustomTable = withStyles((_) => ({
    root: {
        overflowY: 'auto',
        maxHeight: 500,
    }
}))(Table)

const CustomNestedTable = withStyles((_) => ({
    root: {
        maxHeight: '100%',
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
    const statusLegend = useRecoilValue(ActionStatusState);
    const {code: selectedStatus, style} = _.find(statusLegend, ['code', status]) || {
        code: status,
        style: {color: '#d8d8d8'}
    };
    const icon = style?.icon;
    const iconRef = useRef()

    useEffect(()=>{
        iconRef.current.innerHTML = formatSvg(icon, {size: 20, color: generateTextColor(style.color)});
    })

    return <>

        <Card variant='outlined' component={'div'} style={{
            background: style.color,
            textAlign: 'center',
            verticalAlign: 'center',
            color: generateTextColor(style.color),
        }}>
            <Grid container justify='center' style={{padding: 5}}>
                {
                    style.icon &&
                    <Grid item >
                        <CenteredContent>
                                <div style={{paddingTop: 5}} ref={iconRef} />
                        </CenteredContent>
                    </Grid>
                }
                <Grid item>
                    <CenteredContent>
                        {selectedStatus}
                    </CenteredContent>
                </Grid>
            </Grid>
        </Card>
    </>
}

const StatusTableCell = ({status, reference, onDelete, onEdit, setRef, object, ...props}) => {
    const [currentTarget, setCurrentTarget] = useState(false);
    return (
        <StyledStatusTableCell {...props}>
            <Grid item container direction='row' justify='space-between' spacing={1}>
                <Grid item xs={9}>
                    <StatusContainer status={status}/>
                </Grid>
                <Grid container justify='center' alignItems='center' item xs={3}>
                    <Button onClick={(d, e) => {
                        setCurrentTarget(e.currentTarget);
                        setRef(e.currentTarget)
                    }} icon={<MoreHorizIcon/>}/>
                </Grid>
            </Grid>
            {
                (reference && reference === currentTarget) &&
                <TableActionsMenu object={object} onEdit={onEdit} onDelete={onDelete} reference={reference}
                                  onClose={_ => setRef(undefined)}/>
            }
        </StyledStatusTableCell>
    )
}

const DueDateTableCell = ({dueDate, style}) => {
    const warning = false;
    return (
        <CustomTableCell style={{
            background: warning && '#ffecb3',
            maxWidth: style?.maxWidth
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

const NoActionStatus = ({onAddClick}) => {

    return (
        <div>
            <IconButton onClick={onAddClick}>
                <AddIcon/>
            </IconButton>
        </div>
    )
}

const ActionStatusDetails = ({actionStatus}) => {

    return (
        <div>
            <Grid container>
                <Grid item xs={12}>
                    <b> Status</b>
                </Grid>
                <Grid item xs={12}>
                    <StatusContainer status={actionStatus?.status}/>
                </Grid>
                <Grid item xs={12}>
                    <b> Remarks</b>
                </Grid>
                <Grid item xs={12}>
                    {actionStatus?.remarks}
                </Grid>
                <Grid item xs={12}>
                    <b>Review Date</b>
                </Grid>
                <Grid item xs={12}>
                    {actionStatus?.reviewDate}
                </Grid>
            </Grid>
        </div>
    )
}

const ActionStatusTableCell = ({actionStatus, action, refetch}) => {
    const [addActionStatusOpen, setAddActionStatusOpen] = useState(false);
    const styles = {
        margin: 'auto',
        verticalAlign: 'center',
    };

    const onAddClick = () => {
        setAddActionStatusOpen(true);
    }

    return (
        <CustomTableCell style={styles}>
            <CenteredContent>
                {
                    actionStatus ?
                        <ActionStatusDetails actionStatus={actionStatus}/> :
                        <NoActionStatus onAddClick={onAddClick}/>
                }
            </CenteredContent>
            {
                addActionStatusOpen && <ActionStatusDialog onClose={_ => setAddActionStatusOpen(false)} action={action}
                                                           onUpdate={refetch}/>
            }
        </CustomTableCell>
    )
}

const CustomTableCellWithActions = ({object, setRef, reference, onDelete, onEdit, children}) => {
    const [currentTarget, setCurrentTarget] = useState(undefined);
    return (
        <CustomTableCell key={`${object?.id}-description`}>
            <Grid container spacing={1}>
                <Grid item xs={9}>
                    {children}
                </Grid>
                <Grid item xs={3}>
                    <Button key={`${object?.id}-action-menu-button`} onClick={(d, e) => {
                        setRef(e.currentTarget);
                        setCurrentTarget(e.currentTarget);
                    }}
                            icon={<MoreHorizIcon/>}/>
                </Grid>
            </Grid>
            {
                (reference && reference === currentTarget) &&
                <TableActionsMenu
                    object={object}
                    key={`${object.id}-action-menu`}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    reference={reference}
                    onClose={_ => setRef(undefined)}
                />
            }
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
    DueDateTableCell,
    ActionStatusTableCell,
    CustomTableCellWithActions
}
