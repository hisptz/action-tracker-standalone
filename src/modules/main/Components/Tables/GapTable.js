import {
    CustomNestedTable,
    CustomNestingTableCell,
} from "./CustomTable";
import {TableBody, TableRow} from "@material-ui/core";
import _ from "lodash";
import React, {useEffect, useState} from "react";
import SolutionsTable from "./SolutionsTable";
import {Button, CenteredContent, CircularLoader} from "@dhis2/ui";
import Gap from "../../../../core/models/gap";
import {useAlert, useDataQuery} from "@dhis2/app-runtime";
import {generateErrorAlert} from "../../../../core/services/errorHandling.service";
import Bottleneck from "../../../../core/models/bottleneck";
import {useRecoilValue} from "recoil";
import {TableStateSelector} from "../../../../core/states/column";
import {GapConstants} from "../../../../core/constants";
import Grid from "@material-ui/core/Grid";
import Paginator from "../../../../shared/Components/Paginator";
import DeleteConfirmation from "../../../../shared/Components/DeleteConfirmation";
import GapDialog from "../../../../shared/Dialogs/GapDialog";
import {UserRolesState} from "../../../../core/states/user";
import Visibility from "../../../../shared/Components/Visibility";

const gapQuery = {
    data: {
        resource: 'events',
        params: ({trackedEntityInstance, page, pageSize}) => ({
            page,
            pageSize,
            trackedEntityInstance,
            programStage: GapConstants.PROGRAM_STAGE_ID,
            totalPages: true,
            fields: GapConstants.FIELDS
        })
    }
}


export default function GapTable({challenge = new Bottleneck()}) {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const {gapsTable, visibleColumnsCount} = useRecoilValue(TableStateSelector);
    const {gap: gapRoles} = useRecoilValue(UserRolesState);
    const {loading, error, data, refetch} = useDataQuery(gapQuery, {
        variables: {
            trackedEntityInstance: challenge.id,
            page,
            pageSize
        }
    })
    const [addGapOpen, setAddGapOpen] = useState(false)
    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}))
    useEffect(() => generateErrorAlert(show, error), [error]);

    const styles = {
        container:{
            maxHeight: 550,
        },
        tableContainer: {
            height: '100%',
            maxHeight: 450,
            maxWidth: '100%',
            overflow: 'auto'
        }
    }
    useEffect(() => {
        function refresh() {
            refetch({page, pageSize})
        }

        refresh();
    }, [page, pageSize]);
    const onPageChange = (newPage) => setPage(newPage);
    const onPageSizeChange = (newPageSize) => setPageSize(newPageSize)

    const [ref, setRef] = useState(undefined);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedGap, setSelectedGap] = useState(undefined);

    const onDelete = () => {
        setOpenDelete(true);
    }

    const onAdd = () => {
        setSelectedGap(undefined);
        setAddGapOpen(true);
    }

    const onModalClose = (onClose) => {
        setSelectedGap(undefined);
        onClose();
    }

    return (
        <div style={styles.container}>
            <div style={styles.tableContainer}>
                {
                    loading ? <CenteredContent>
                            <CircularLoader small/>
                        </CenteredContent> :
                        <CustomNestedTable>
                            <colgroup>
                                {
                                    gapsTable?.columns?.map(({visible, name}) => visible && <col key={`col-${name}`} width={`${100 / visibleColumnsCount}%`}/>)
                                }
                            </colgroup>
                            <TableBody>
                                {
                                    _.map(_.map(data?.data?.events, (event) => new Gap(event)), (gap) =>
                                        <TableRow
                                            key={`${gap.id}-row`}>
                                            {
                                                _.map(gapsTable.columns, ({render, visible}) => {
                                                    if (render && visible) return render(gap, {
                                                        roles: gapRoles,
                                                        ref,
                                                        setRef,
                                                        onEdit: () => {
                                                            setSelectedGap(gap);
                                                            setAddGapOpen(true);
                                                        },
                                                        onDelete: () => {
                                                            setSelectedGap(gap);
                                                            onDelete();
                                                        }
                                                    });
                                                })
                                            }
                                            <CustomNestingTableCell key={`${gap.id}-solutions`}
                                                                    colSpan={(visibleColumnsCount - gapsTable.visibleColumnsCount)}
                                                                    style={{padding: 0}}>
                                                {
                                                    <SolutionsTable gap={gap}/>
                                                }
                                            </CustomNestingTableCell>
                                        </TableRow>)
                                }
                                {
                                    addGapOpen &&
                                    <GapDialog gap={selectedGap} challenge={challenge}
                                               onClose={_ => onModalClose(_ => setAddGapOpen(false))}
                                               onUpdate={_ => refetch()}/>

                                }
                            </TableBody>
                        </CustomNestedTable>
                }
            </div>
            <Grid container direction='row' justify='space-between' style={{padding: 5}}>
                <Grid item>
                    <Visibility visible={gapRoles?.create}>
                        <Button dataTest='add-bottleneck-button' onClick={onAdd}>Add Bottleneck</Button>
                    </Visibility>
                </Grid>
                <Grid item>
                    {
                        (data && data?.data?.pager.total > 5) &&
                        <Paginator pager={data?.data?.pager} onPageSizeChange={onPageSizeChange}
                                   onPageChange={onPageChange}/>
                    }
                    {
                        openDelete && <DeleteConfirmation
                            type='event'
                            message='Are you sure you want to delete this bottleneck and all related solutions and actions?'
                            onClose={_ => onModalClose(_ => setOpenDelete(false))}
                            id={selectedGap?.id}
                            deletionSuccessMessage='Bottleneck Deleted Successfully'
                            onUpdate={refetch}
                        />
                    }</Grid>
            </Grid>
        </div>
    )
}
