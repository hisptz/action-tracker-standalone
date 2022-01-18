import {CustomNestedTable, CustomNestingTableCell} from "./CustomTable";
import {Container, TableBody, TableRow} from "@material-ui/core";
import * as _ from "lodash";
import React, {useEffect, useMemo, useState} from "react";
import {Button, CenteredContent, CircularLoader} from "@dhis2/ui";
import ActionTable from "./ActionTable";
import PossibleSolution from "../../../../core/models/possibleSolution";
import {BottleneckConstants, PossibleSolutionConstants,} from "../../../../core/constants";
import {useAlert, useDataQuery} from "@dhis2/app-runtime";
import {generateErrorAlert} from "../../../../core/services/errorHandling.service";
import Gap from "../../../../core/models/gap";
import SolutionsDialog from "../../../../shared/Dialogs/SolutionsDialog";
import {useRecoilValue} from "recoil";
import {TableStateSelector} from "../../../../core/states/column";
import Grid from "@material-ui/core/Grid";
import Paginator from "../../../../shared/Components/Paginator";
import DeleteConfirmation from "../../../../shared/Components/DeleteConfirmation";
import {UserRolesState} from "../../../../core/states/user";
import Visibility from "../../../../shared/Components/Visibility";
import i18n from '@dhis2/d2-i18n'
import {sanitizedData} from "../../../../shared/utils/data";

const possibleSolutionQuery = {
    data: {
        resource: 'events/query',
        params: ({trackedEntityInstance, page, pageSize, linkage}) => ({
            page,
            pageSize,
            trackedEntityInstance,
            program: BottleneckConstants.PROGRAM_ID,
            programStage: PossibleSolutionConstants.PROGRAM_STAGE_ID,
            totalPages: true,
            filter: [
                `${PossibleSolutionConstants.GAP_TO_SOLUTION_LINKAGE_DATA_ELEMENT}:eq:${linkage}`
            ],
            fields: PossibleSolutionConstants.FIELDS
        })
    }
}


export default function SolutionsTable({gap = new Gap()}) {
    const [page, setPage] = useState(1);
    const {solutionsTable, visibleColumnsCount, gapsTable} = useRecoilValue(TableStateSelector);
    const {possibleSolution: solutionRoles} = useRecoilValue(UserRolesState);
    const [pageSize, setPageSize] = useState(5);
    const {loading, error, data: rawData, refetch} = useDataQuery(possibleSolutionQuery, {
        variables: {
            trackedEntityInstance: gap.indicatorId,
            page,
            pageSize,
            linkage: gap.solutionLinkage
        }
    })

    const data = useMemo(() => {
        if (rawData) {
            return sanitizedData(rawData.data);
        }
        return []
    }, [rawData])

    useEffect(() => {
        function refresh() {
            refetch({page, pageSize})
        }

        refresh();
    }, [page, pageSize]);

    const onModalClose = (onClose) => {
        setSelectedSolution(undefined);
        onClose()
    }

    const onPageChange = (newPage) => setPage(newPage);
    const onPageSizeChange = (newPageSize) => setPageSize(newPageSize);

    const [addSolutionOpen, setAddSolutionOpen] = useState(false)
    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}))
    useEffect(() => generateErrorAlert(show, error), [error])

    const [ref, setRef] = useState(undefined);
    const [selectedSolution, setSelectedSolution] = useState(undefined);
    const [openDelete, setOpenDelete] = useState(false);

    const onDelete = () => {
        setOpenDelete(true);
    }

    const styles = {
        container: {
            maxHeight: 700,
        },
        tableContainer: {
            height: '100%',
            overflow: 'auto',
            width: '100%',
            maxHeight: 700,
        }
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
                                    solutionsTable.columns.map(_ => _.visible && <col key={`col-${_}`}
                                                                                      width={`${100 / (visibleColumnsCount - gapsTable.visibleColumnsCount)}%`}/>)
                                }
                            </colgroup>
                            <TableBody>
                                {
                                    _.map(_.map(data, (event) => PossibleSolution.fromQueryObject(event, gap.indicatorId)), (solution) =>
                                        <TableRow key={`${solution.id}-row`}>
                                            {
                                                _.map(solutionsTable.columns, ({render, visible}) => {
                                                    if (render && visible) return render(solution, {
                                                        roles: solutionRoles,
                                                        ref, setRef,
                                                        onEdit: () => {
                                                            setSelectedSolution(solution);
                                                            setAddSolutionOpen(true);
                                                        },
                                                        onDelete: () => {
                                                            setSelectedSolution(solution);
                                                            onDelete();
                                                        }
                                                    });
                                                })
                                            }
                                            <CustomNestingTableCell key={`${solution.id}-actions`}
                                                                    colSpan={(visibleColumnsCount - (solutionsTable.visibleColumnsCount + gapsTable.visibleColumnsCount))}
                                                                    style={{padding: 0}}>
                                                <ActionTable solution={solution}/>
                                            </CustomNestingTableCell>
                                        </TableRow>)
                                }
                            </TableBody>
                        </CustomNestedTable>
                }
            </div>
            {
                <Container maxWidth={false} padding={{padding: 5}}>
                    <Grid container direction='row' justify='space-between' style={{padding: 5}}>
                        <Grid item>
                            <Visibility visible={solutionRoles?.create}>
                                <Button dataTest='add-solution-button'
                                        onClick={_ => setAddSolutionOpen(true)}>{i18n.t('Add Solution')}</Button>
                            </Visibility>
                        </Grid>
                        <Grid item>
                            {
                                (data && data?.data?.pager.total > 5) &&
                                <Paginator pager={data?.data?.pager} onPageSizeChange={onPageSizeChange}
                                           onPageChange={onPageChange}/>

                            }
                        </Grid>

                    </Grid>
                </Container>
            }
            {
                addSolutionOpen &&
                <SolutionsDialog solution={selectedSolution} onUpdate={refetch} gap={gap}
                                 onClose={_ => onModalClose(_ => setAddSolutionOpen(false))}/>
            }
            {
                openDelete &&
                <DeleteConfirmation
                    type='event'
                    message={i18n.t('Are you sure you want to delete this solution and all related actions?')}
                    onClose={_ => onModalClose(_ => setOpenDelete(false))}
                    id={selectedSolution?.id}
                    deletionSuccessMessage={i18n.t('Solution Deleted Successfully')}
                    onUpdate={refetch}
                />
            }
        </div>
    )
}
