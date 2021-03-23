import {
    CustomNestedTable,
    CustomNestingTableCell,
} from "./CustomTable";
import {CardContent, TableBody, TableRow} from "@material-ui/core";
import _ from "lodash";
import React, {useEffect, useState} from "react";
import SolutionsTable from "./SolutionsTable";
import {Button, CenteredContent, CircularLoader} from "@dhis2/ui";
import Gap from "../../../../core/models/gap";
import {useAlert, useDataQuery} from "@dhis2/app-runtime";
import generateErrorAlert from "../../../../core/services/generateErrorAlert";
import Bottleneck from "../../../../core/models/bottleneck";
import {useRecoilValue} from "recoil";
import {LiveColumnState} from "../../../../core/states/column";
import {GapConstants} from "../../../../core/constants";
import Grid from "@material-ui/core/Grid";
import Paginator from "../../../../shared/Components/Paginator";
import DeleteConfirmation from "../../../../shared/Components/DeleteConfirmation";
import GapDialog from "../../../../shared/Dialogs/GapDialog";

const gapQuery = {
    data: {
        resource: 'events',
        params: ({trackedEntityInstance, page, pageSize}) => ({
            page,
            pageSize,
            trackedEntityInstance,
            programStage: GapConstants.PROGRAM_STAGE_ID,
            totalPages: true,
            fields: [
                'programStage',
                'trackedEntityInstance',
                'event',
                'dataValues[dataElement, value]',
                'eventDate',
                'orgUnit'
            ]
        })
    }
}


export default function GapTable({challenge = new Bottleneck()}) {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const {columns, gapsTable, visibleColumnsCount} = useRecoilValue(LiveColumnState);
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
        container: {
            maxHeight: 420,
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

    const onModalClose = (onClose) =>{
        setSelectedGap(undefined);
        onClose();
    }

    return (
        <div>
            <div style={styles.container}>
                {
                    loading ? <CenteredContent>
                            <CircularLoader small/>
                        </CenteredContent> :
                        <CustomNestedTable>
                            <colgroup span={7}>
                                <col width={`${100 / columns.length}%`}/>
                            </colgroup>
                            <TableBody>
                                {
                                    _.map(_.map(data?.data?.events, (event) => new Gap(event)), (gap) => <TableRow
                                        key={`${gap.id}-row`}>
                                        {
                                            _.map(gapsTable, (columnName) => {
                                                const {render, visible} = _.find(columns, ['name', columnName]) || {};
                                                if (render && visible) return render(gap, {
                                                    ref, setRef, onEdit: () => {
                                                        setSelectedGap(gap);
                                                        setAddGapOpen(true);
                                                    }, onDelete: () => {
                                                        setSelectedGap(gap);
                                                        onDelete();
                                                    }
                                                });
                                            })
                                        }
                                        <CustomNestingTableCell key={`${gap.id}-solutions`}
                                                                colSpan={(visibleColumnsCount - gapsTable.length)}
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
                                               onClose={_=> onModalClose(_ => setAddGapOpen(false))}
                                               onUpdate={_ => refetch()}/>

                                }
                            </TableBody>
                        </CustomNestedTable>
                }
            </div>

            <Grid container direction='row' justify='space-between' style={{padding: 5}}>
                <Grid item>
                    <Button onClick={onAdd}>Add Gap</Button>
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
                            message='Are you sure you want to delete this gap and all related solutions and actions?'
                            onClose={_=> onModalClose(_ => setOpenDelete(false))}
                            id={selectedGap?.id}
                            deletionSuccessMessage='Gap Deleted Successfully'
                            onUpdate={refetch}
                        />
                    }</Grid>
            </Grid>
        </div>
    )
}
