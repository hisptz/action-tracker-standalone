import {Grid, IconButton, Table, TableCell, TableFooter, TableRow, withStyles} from "@material-ui/core";
import {Button, CenteredContent} from '@dhis2/ui'
import DueDateWarningIcon from '@material-ui/icons/ReportProblemOutlined';
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import React, {useEffect, useRef, useState} from "react";
import {ActionConstants} from "../../../../core/constants/action";
import AddIcon from '@material-ui/icons/Add';
import ActionStatusDialog from "../../../../shared/Dialogs/ActionStatusDialog";
import TableActionsMenu from "../TableActionsMenu";
import {ActionStatusState} from "../../../../core/states";
import {useRecoilValue} from "recoil";
import * as _ from "lodash";
import {formatSvg, generateTextColor} from "../../../../core/helpers/utils/utils";
import DHIS2Icon from "../../../../shared/Components/DHIS2Icon";
import i18n from '@dhis2/d2-i18n'

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
        fontWeight: 'normal',
        minWidth: 150
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
        overflow: 'auto',
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
        paddingTop: 10,
        fontSize: 14,
        minWidth: 50
    }
}))(TableCell)

const StatusContainer = ({status}) => {
    const statusLegend = useRecoilValue(ActionStatusState);
    const {code: selectedStatus, style} = _.find(statusLegend, ['code', status]) || {
        code: status,
        style: {color: '#6E7A8A'}
    };
    const icon = style?.icon;
    const iconRef = useRef()

    useEffect(() => {
        if (iconRef.current) {
            iconRef.current.innerHTML = formatSvg(icon, {
                size: 14,
                color: generateTextColor(style?.color || '#6E7A8A')
            });
        }
    }, [])

    return <>
        <b style={{color: style?.color || '#6E7A8A'}}>{selectedStatus}</b>
    </>
}

const StatusTableCell = ({status, reference, onDelete, onEdit, setRef, object, roles, ...props}) => {
    const [currentTarget, setCurrentTarget] = useState(false);
    const {update: canUpdate, delete: canDelete} = roles || {canUpdate: false, canDelete: false};
    const statusLegend = useRecoilValue(ActionStatusState);
    const {code: selectedStatus, style} = _.find(statusLegend, ['code', status]) || {
        code: status,
        style: {color: '#6E7A8A'}
    };
    const icon = style?.icon;
    return (
        <StyledStatusTableCell {...props} style={{
            background: `${style?.color || '#6E7A8A'}70`,
            textAlign: 'center',
            verticalAlign: 'top',
            color: generateTextColor(style?.color || '#6E7A8A'),
        }}>
            <Grid item container direction='row' justify='space-between' spacing={1}>
                <Grid item xs={(canDelete || canUpdate) ? 9 : 12} container justify='center' alignItems='center'
                      className="status-cell-grid">
                    {
                        style?.icon &&
                        <Grid item className="status-icon-grid">
                            <CenteredContent>
                                <DHIS2Icon iconName={icon}/>
                            </CenteredContent>
                        </Grid>
                    }
                    <Grid item className="status-cell-grid-item">
                        <CenteredContent>
                            {selectedStatus}
                        </CenteredContent>
                    </Grid>
                </Grid>
                <Grid container justify='center' alignItems='center' item xs={(canDelete || canUpdate) ? 3 : 12}>
                    {
                        (canDelete || canUpdate) &&
                        <Button onClick={(d, e) => {
                            setCurrentTarget(e.currentTarget);
                            setRef(e.currentTarget)
                        }} icon={<MoreHorizIcon/>}/>
                    }
                </Grid>
            </Grid>
            {
                (reference && reference === currentTarget) &&
                <TableActionsMenu roles={roles} object={object} onEdit={onEdit} onDelete={onDelete}
                                  reference={reference}
                                  onClose={_ => setRef(undefined)}/>
            }
        </StyledStatusTableCell>
    )
}

const DueDateTableCell = ({dueDate, pastDate, style}) => {
    return (
        <CustomTableCell style={{
            background: pastDate && '#ffecb3',
            maxWidth: style?.maxWidth
        }}>
            <Grid container direction='row' spacing={1}>
                {
                    pastDate &&
                    <Grid item>
                        <DueDateWarningIcon fontSize='small' style={{color: pastDate && '#6f3205'}}/>
                    </Grid>
                }
                <Grid item>
                    <span style={{color: pastDate && '#6f3205'}}>{dueDate}</span>
                </Grid>
            </Grid>
        </CustomTableCell>
    )
}

const NoActionStatus = ({onAddClick}) => {

    return (
        <div>
            <IconButton id='add-action-status-button' onClick={onAddClick}>
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
                    <b>{i18n.t('Status')}</b>
                </Grid>
                <Grid item xs={12}>
                    <StatusContainer status={actionStatus?.status}/>
                </Grid>
                <Grid item xs={12}>
                    <b>{i18n.t('Remarks')}</b>
                </Grid>
                <Grid id='action-status-remarks' item xs={12}>
                    {actionStatus?.remarks}
                </Grid>
                <Grid item xs={12}>
                    <b>{i18n.t('Review Date')}</b>
                </Grid>
                <Grid id='action-status-review-date' item xs={12}>
                    {actionStatus?.reviewDate}
                </Grid>
            </Grid>
        </div>
    )
}

const ActionStatusTableCell = ({actionStatus, action, refetch, roles, startDate, endDate, disabled}) => {
    const [addActionStatusOpen, setAddActionStatusOpen] = useState(false);
    const styles = {
        margin: 'auto',
        verticalAlign: 'center',
        border: 'none'
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
                        (!disabled && roles?.create) ? <NoActionStatus onAddClick={onAddClick}/> : <></>
                }
            </CenteredContent>
            {
                addActionStatusOpen &&
                <ActionStatusDialog startDate={startDate} endDate={endDate} onClose={_ => setAddActionStatusOpen(false)}
                                    action={action}
                                    onUpdate={refetch}/>
            }
        </CustomTableCell>
    )
}

const CustomTableCellWithActions = ({object, setRef, reference, onDelete, onEdit, children, roles}) => {
    const [currentTarget, setCurrentTarget] = useState(undefined);
    const {update: canUpdate, delete: canDelete} = roles || {canUpdate: false, canDelete: false};
    return (
        <CustomTableCell key={`${object?.id}-description`}>
            <Grid container spacing={1}>
                <Grid item xs={(canDelete || canUpdate) ? 8 : 12}>
                    {children}
                </Grid>
                <Grid item xs={(canDelete || canUpdate) ? 4 : 0}>
                    {
                        (canDelete || canUpdate) &&
                        <Button key={`${object?.id}-action-menu-button`} onClick={(d, e) => {
                            setRef(e.currentTarget);
                            setCurrentTarget(e.currentTarget);
                        }}
                                icon={<MoreHorizIcon/>}/>
                    }
                </Grid>
            </Grid>
            {
                (reference && reference === currentTarget) &&
                <TableActionsMenu
                    roles={roles}
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
