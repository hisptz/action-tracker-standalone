import {CustomNestedTable, CustomTableCell,} from "./CustomTable";
import {Container, TableBody, TableRow} from "@material-ui/core";
import * as _ from "lodash";
import React, {useEffect, useState} from "react";
import Action from "../../../../core/models/action";
import {useRecoilValue} from "recoil";
import {DimensionsState, StatusFilterState} from "../../../../core/states";
import {useDataQuery} from "@dhis2/app-runtime";
import {Button, CenteredContent, CircularLoader} from "@dhis2/ui";
import ActionItemDialog from "../../../../shared/Dialogs/ActionItemDialog";
import PossibleSolution from "../../../../core/models/possibleSolution";
import {ActionConstants} from "../../../../core/constants";
import {TableStateSelector} from "../../../../core/states/column";
import Grid from "@material-ui/core/Grid";
import Paginator from "../../../../shared/Components/Paginator";
import DeleteConfirmation from "../../../../shared/Components/DeleteConfirmation";
import ActionStatus from "../../../../core/models/actionStatus";
import ActionStatusDialog from "../../../../shared/Dialogs/ActionStatusDialog";
import {UserRolesState} from "../../../../core/states/user";
import Visibility from "../../../../shared/Components/Visibility";
import i18n from '@dhis2/d2-i18n'

const actionsQuery = {
    actions: {
        resource: 'trackedEntityInstances',
        params: ({ou, solutionToActionLinkage, page, pageSize, startDate, endDate}) => ({
            program: ActionConstants.PROGRAM_ID,
            ou,
            page,
            pageSize,
            totalPages: true,
            fields: ActionConstants.ACTION_QUERY_FIELDS,
            ouMode: 'DESCENDANTS',
            filter: [
                `${ActionConstants.ACTION_TO_SOLUTION_LINKAGE}:eq:${solutionToActionLinkage}`,
                `${ActionConstants.START_DATE_ATTRIBUTE}:ge:${startDate}`,
                `${ActionConstants.END_DATE_ATTRIBUTE}:le:${endDate}`
            ],
            order: 'created:asc',
        })
    }
}

export default function ActionTable({solution = new PossibleSolution()}) {
    const [page, setPage] = useState(1);
    const {selected: selectedStatus} = useRecoilValue(StatusFilterState);
    const [pageSize, setPageSize] = useState(5);
    const {orgUnit, period} = useRecoilValue(DimensionsState);
    const {actionsTable, actionStatusTable, visibleColumnsCount} = useRecoilValue(TableStateSelector);
    const {action: actionRoles, actionStatus: actionStatusRoles} = useRecoilValue(UserRolesState);
    const [addActionOpen, setAddActionOpen] = useState(false);

    const {start: startDate, end: endDate} = period;
    const {loading, data, error, refetch} = useDataQuery(actionsQuery, {
        variables: {
            ou: orgUnit?.id,
            solutionToActionLinkage: solution.actionLinkage,
            page,
            pageSize,
            startDate: startDate.toFormat(`yyyy-MM-dd`),
            endDate: endDate.toFormat(`yyyy-MM-dd`)
        },
        lazy: true
    });

    useEffect(() => {
        function refresh() {
            refetch({
                page,
                pageSize,
                ou: orgUnit?.id,
                solutionToActionLinkage: solution.actionLinkage,
                startDate: startDate.toFormat(`yyyy-MM-dd`),
                endDate: endDate.toFormat(`yyyy-MM-dd`)
            })
        }

        refresh();
    }, [page, pageSize, orgUnit, period]);

    const onPageChange = (newPage) => setPage(newPage);
    const onPageSizeChange = (newPageSize) => setPageSize(newPageSize);

    const [ref, setRef] = useState(undefined);
    const [selectedAction, setSelectedAction] = useState(undefined);
    const [selectedActionStatus, setSelectedActionStatus] = useState(undefined);
    const [openAddActionStatus, setOpenAddActionStatus] = useState(false)
    const [openDelete, setOpenDelete] = useState(false);

    const onDelete = () => {
        setOpenDelete(true);
    }

    const onActionStatusModalClose = (onClose) => {
        setSelectedActionStatus(undefined);
        onClose();
    }

    const onActionModalClose = (onClose) => {
        setSelectedAction(undefined);
        onClose()
    }

    const styles = {
        container: {
            maxHeight: 500,
            width: '100%',
            overflow: 'auto'
        }
    };

    return (
        <div>
            <div style={styles.container}>
                <CustomNestedTable>
                    <colgroup>
                        {
                            actionsTable.columns.map(_ => _.visible &&
                                <col key={`col-${_.name}`} width={`${100 / visibleColumnsCount}%`}/>)
                        }
                        {
                            actionStatusTable.visible && actionStatusTable.columns.map(_ => <col key={`col-${_.name}`}
                                                                                                 width={`${100 / visibleColumnsCount}%`}/>)
                        }
                    </colgroup>
                    <TableBody>
                        {
                            loading && <TableRow><CustomTableCell><CenteredContent><CircularLoader
                                small/></CenteredContent></CustomTableCell></TableRow>
                        }
                        {
                            error &&
                            <TableRow><CustomTableCell><CenteredContent>{error?.message || error.toString()}</CenteredContent></CustomTableCell></TableRow>
                        }
                        {
                            data && <>
                                {
                                    selectedStatus ? _.map(_.filter(_.map(data?.actions?.trackedEntityInstances, (trackedEntityInstance) => new Action(trackedEntityInstance)), (action) => action?.latestStatus === selectedStatus), (action) =>
                                            <TableRow key={`${action?.id}-row`}>
                                                {
                                                    _.map(actionsTable.columns, ({render, visible}) => {
                                                        if (render && visible) return render(action, refetch, {
                                                            roles: actionRoles,
                                                            onDelete: (object) => {
                                                                if (object instanceof Action) {
                                                                    setSelectedActionStatus(undefined)
                                                                    setSelectedAction(action);
                                                                    onDelete();
                                                                }
                                                                if (object instanceof ActionStatus) {
                                                                    setSelectedAction(undefined)
                                                                    setSelectedActionStatus(object);
                                                                    onDelete();
                                                                }
                                                            },
                                                            onEdit: (object) => {
                                                                if (object instanceof Action) {
                                                                    setSelectedActionStatus(undefined)
                                                                    setSelectedAction(object);
                                                                    setAddActionOpen(true);
                                                                }
                                                                if (object instanceof ActionStatus) {
                                                                    setSelectedAction(undefined)
                                                                    setSelectedActionStatus(object);
                                                                    setOpenAddActionStatus(true);
                                                                }
                                                            },
                                                            ref, setRef
                                                        }, 100 / visibleColumnsCount);
                                                    })
                                                }{
                                                actionStatusTable.visible &&
                                                _.map(actionStatusTable.columns, ({render, visible}) => {
                                                    if (render && visible) return render(action, refetch, {
                                                        roles: actionStatusRoles,
                                                        onDelete: (object) => {
                                                            if (object instanceof Action) {
                                                                setSelectedActionStatus(undefined)
                                                                setSelectedAction(action);
                                                                onDelete();
                                                            }
                                                            if (object instanceof ActionStatus) {
                                                                setSelectedAction(undefined)
                                                                setSelectedActionStatus(object);
                                                                onDelete();
                                                            }
                                                        },
                                                        onEdit: (object) => {
                                                            if (object instanceof Action) {
                                                                setSelectedActionStatus(undefined)
                                                                setSelectedAction(object);
                                                                setAddActionOpen(true);
                                                            }
                                                            if (object instanceof ActionStatus) {
                                                                setSelectedAction(undefined)
                                                                setSelectedActionStatus(object);
                                                                setOpenAddActionStatus(true);
                                                            }
                                                        },
                                                        ref, setRef
                                                    }, 100 / visibleColumnsCount);
                                                })
                                            }
                                            </TableRow>
                                        ) :
                                        _.map(_.map(data?.actions?.trackedEntityInstances, (trackedEntityInstance) => new Action(trackedEntityInstance)), (action) =>
                                            <TableRow key={`${action?.id}-row`}>
                                                {
                                                    _.map(actionsTable.columns, ({
                                                                                     render,
                                                                                     visible
                                                                                 }) => {
                                                        if (render && visible) return render(action, refetch, {
                                                            roles: actionRoles,
                                                            onDelete: (object) => {
                                                                if (object instanceof Action) {
                                                                    setSelectedActionStatus(undefined)
                                                                    setSelectedAction(action);
                                                                    onDelete();
                                                                }
                                                                if (object instanceof ActionStatus) {
                                                                    setSelectedAction(undefined)
                                                                    setSelectedActionStatus(object);
                                                                    onDelete();
                                                                }
                                                            },
                                                            onEdit: (object) => {
                                                                if (object instanceof Action) {
                                                                    setSelectedActionStatus(undefined)
                                                                    setSelectedAction(object);
                                                                    setAddActionOpen(true);
                                                                }
                                                                if (object instanceof ActionStatus) {
                                                                    setSelectedAction(undefined)
                                                                    setSelectedActionStatus(object);
                                                                    setOpenAddActionStatus(true);
                                                                }
                                                            },
                                                            ref, setRef
                                                        }, 100 / visibleColumnsCount);
                                                    })
                                                }
                                                {
                                                    actionStatusTable.visible &&
                                                    _.map(actionStatusTable.columns, ({
                                                                                          render,
                                                                                          visible
                                                                                      }) => {
                                                        if (render && visible) return render(action, refetch, {
                                                            roles: actionStatusRoles,
                                                            onDelete: (object) => {
                                                                if (object instanceof Action) {
                                                                    setSelectedActionStatus(undefined)
                                                                    setSelectedAction(action);
                                                                    onDelete();
                                                                }
                                                                if (object instanceof ActionStatus) {
                                                                    setSelectedAction(undefined)
                                                                    setSelectedActionStatus(object);
                                                                    onDelete();
                                                                }
                                                            },
                                                            onEdit: (object) => {
                                                                if (object instanceof Action) {
                                                                    setSelectedActionStatus(undefined)
                                                                    setSelectedAction(object);
                                                                    setAddActionOpen(true);
                                                                }
                                                                if (object instanceof ActionStatus) {
                                                                    setSelectedAction(undefined)
                                                                    setSelectedActionStatus(object);
                                                                    setOpenAddActionStatus(true);
                                                                }
                                                            },
                                                            ref, setRef
                                                        }, 100 / visibleColumnsCount);
                                                    })
                                                }
                                            </TableRow>
                                        )
                                }
                            </>
                        }
                    </TableBody>
                </CustomNestedTable>
            </div>
            <Container maxWidth={false}>
                <Grid container direction='row' justify='space-between' style={{padding: 5}}>
                    <Grid item>
                        <Visibility visible={actionRoles?.create}>
                            <Button dataTest='add-action-button'
                                    onClick={_ => setAddActionOpen(true)}>{i18n.t('Add Activity')}</Button>
                        </Visibility>

                    </Grid>
                    <Grid item>
                        {
                            (data && data?.actions?.pager.total > 5) &&
                            <Paginator pager={data?.actions?.pager} onPageSizeChange={onPageSizeChange}
                                       onPageChange={onPageChange}/>
                        }
                    </Grid>
                </Grid>
            </Container>
            {
                addActionOpen &&
                <ActionItemDialog action={selectedAction} solution={solution} onUpdate={refetch}
                                  onClose={_ => onActionModalClose(_ => setAddActionOpen(false))}/>
            }
            {
                openAddActionStatus &&
                <ActionStatusDialog actionStatus={selectedActionStatus} solution={solution} onUpdate={refetch}
                                    onClose={_ => onActionStatusModalClose(_ => setOpenAddActionStatus(false))}/>
            }
            {
                openDelete &&
                <DeleteConfirmation
                    type={selectedAction ? 'trackedEntityInstance' : 'event'}
                    message={selectedAction ? i18n.t('Are you sure you want to delete this activity and all related actions status?') : i18n.t('Are you sure you want to delete this activity status?')}
                    onClose={_ => {
                        if (selectedAction) onActionModalClose(_ => setOpenDelete(false));
                        else onActionStatusModalClose(_ => setOpenDelete(false))
                    }
                    }
                    id={selectedAction?.id || selectedActionStatus?.id}
                    deletionSuccessMessage={i18n.t('Sub activity Deleted Successfully')}
                    onUpdate={refetch}
                />
            }
        </div>
    )
}
