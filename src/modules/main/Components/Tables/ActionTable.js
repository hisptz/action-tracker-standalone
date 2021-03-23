import {
    CustomNestedTable,
    CustomTableCell,
} from "./CustomTable";
import {TableBody, TableRow} from "@material-ui/core";
import _ from "lodash";
import React, {useEffect, useState} from "react";
import Action from "../../../../core/models/action";
import {useRecoilValue} from "recoil";
import {DimensionsState} from "../../../../core/states";
import {useDataQuery} from "@dhis2/app-runtime";
import {Button, CenteredContent, CircularLoader} from "@dhis2/ui";
import ActionItemDialog from "../../../../shared/Dialogs/ActionItemDialog";
import PossibleSolution from "../../../../core/models/possibleSolution";
import {ActionConstants} from "../../../../core/constants";
import {LiveColumnState} from "../../../../core/states/column";
import Grid from "@material-ui/core/Grid";
import Paginator from "../../../../shared/Components/Paginator";
import DeleteConfirmation from "../../../../shared/Components/DeleteConfirmation";


const actionsQuery = {
    actions: {
        resource: 'trackedEntityInstances',
        params: ({ou, solutionToActionLinkage, page, pageSize}) => ({
            program: 'unD7wro3qPm',
            ou,
            page,
            pageSize,
            totalPages: true,
            fields: [
                'trackedEntityInstance',
                'attributes[attribute,value]',
                'enrollments[events[trackedEntityInstance,eventDate,programStage,event,dataValues[dataElement,value]]]'
            ],
            filter: [
                `${ActionConstants.ACTION_TO_SOLUTION_LINKAGE}:eq:${solutionToActionLinkage}`
            ]
        })
    }
}

export default function ActionTable({solution = new PossibleSolution()}) {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const {orgUnit} = useRecoilValue(DimensionsState);
    const {columns, actionsTable, visibleColumnsCount} = useRecoilValue(LiveColumnState);
    const [addActionOpen, setAddActionOpen] = useState(false)
    const {loading, data, error, refetch} = useDataQuery(actionsQuery, {
        variables: {
            ou: orgUnit?.id,
            solutionToActionLinkage: solution.actionLinkage,
            page,
            pageSize
        },
        lazy: true
    });

    useEffect(() => {
        function refresh() {
            refetch({page, pageSize})
        }

        refresh();
    }, [page, pageSize]);

    const onPageChange = (newPage) => setPage(newPage);
    const onPageSizeChange = (newPageSize) => setPageSize(newPageSize);

    const [ref, setRef] = useState(undefined);
    const [selectedAction, setSelectedAction] = useState(undefined);
    const [openDelete, setOpenDelete] = useState(false);

    const onDelete = () => {
        setOpenDelete(true);
    }

    const styles = {
        container: {height: '100%', overflow: 'auto'}
    }

    return (
        <div>
            <div style={styles.container}>
                <CustomNestedTable>
                    <colgroup>
                        {
                            actionsTable.map(_ => <col key={`col-${_}`} width={`${100 / visibleColumnsCount}%`}/>)
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

                                    _.map(_.map(data.actions.trackedEntityInstances, (trackedEntityInstance) => new Action(trackedEntityInstance)), (action) =>
                                        <TableRow key={`${action.id}-row`}>
                                            {
                                                _.map(actionsTable, (columnName) => {
                                                    const {
                                                        render,
                                                        visible
                                                    } = _.find(columns, ['name', columnName]) || {};
                                                    if (render && visible) return render(action, refetch, {
                                                        onDelete: () => {
                                                            setSelectedAction(action);
                                                            onDelete();
                                                        },
                                                        onEdit: () => {
                                                        },
                                                        ref, setRef
                                                    });
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
            <Grid container direction='row' justify='space-between' style={{padding: 5}}>
                <Grid item>
                    <Button onClick={_ => setAddActionOpen(true)}>Add Action Item</Button>
                </Grid>
                <Grid item>
                    {
                        (data && data?.actions?.pager.total > 5) &&
                        <Paginator pager={data?.actions?.pager} onPageSizeChange={onPageSizeChange}
                                   onPageChange={onPageChange}/>
                    }
                </Grid>
            </Grid>
            {
                addActionOpen &&
                <ActionItemDialog solution={solution} onUpdate={refetch} onClose={_ => setAddActionOpen(false)}/>
            }
            {
                openDelete &&
                <DeleteConfirmation
                    type='trackedEntityInstance'
                    message='Are you sure you want to delete this actions and all related actions status?'
                    onClose={_ => setOpenDelete(false)}
                    id={selectedAction?.id}
                    deletionSuccessMessage='Action Deleted Successfully'
                    onUpdate={refetch}
                />
            }
        </div>
    )
}
