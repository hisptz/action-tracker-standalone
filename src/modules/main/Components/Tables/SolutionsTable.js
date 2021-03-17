import {CustomNestedTable, CustomNestingTableCell, CustomTableCell, CustomTableFooter} from "./CustomTable";
import {TableBody, TableRow} from "@material-ui/core";
import _ from "lodash";
import React, {useEffect, useState} from "react";
import {Button, CenteredContent, CircularLoader} from "@dhis2/ui";
import ActionTable from "./ActionTable";
import PossibleSolution from "../../../../core/models/possibleSolution";
import {
    BOTTLENECK_PROGRAM_ID,
    GAP_SOLUTION_LINKAGE,
    POSSIBLE_SOLUTION_PROGRAM_STAGE_ID
} from "../../../../core/constants";
import {useAlert, useDataQuery} from "@dhis2/app-runtime";
import generateErrorAlert from "../../../../core/services/generateErrorAlert";
import Gap from "../../../../core/models/gap";
import SolutionsDialog from "../../../../shared/Dialogs/SolutionsDialog";

const possibleSolutionQuery = {
    data: {
        resource: 'events',
        params: ({trackedEntityInstance, page, pageSize, linkage}) => ({
            page,
            pageSize,
            trackedEntityInstance,
            program: BOTTLENECK_PROGRAM_ID,
            programStage: POSSIBLE_SOLUTION_PROGRAM_STAGE_ID,
            totalPages: true,
            filter: [
                `${GAP_SOLUTION_LINKAGE}:eq:${linkage}`
            ],
            fields: [
                'programStage',
                'event',
                'dataValues[dataElement, value]',
                'eventDate',
                'orgUnit'
            ]
        })
    }
}


export default function SolutionsTable({gap = new Gap()}) {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const {loading, error, data, refetch} = useDataQuery(possibleSolutionQuery, {
        variables: {
            trackedEntityInstance: gap.indicatorId,
            page,
            pageSize,
            linkage: gap.solutionLinkage
        }
    })
    const [addSolutionOpen, setAddSolutionOpen] = useState(false)
    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}))
    useEffect(() => generateErrorAlert(show, error), [error])

    return (
        <div>
            <div style={{height: '100%', overflow: 'auto'}}>
                {
                    loading ?  <CenteredContent>
                        <CircularLoader small />
                    </CenteredContent>:
                        <CustomNestedTable>
                            <colgroup span={6}>
                                <col width={`${100/7}%`} />
                            </colgroup>
                            <TableBody>
                                {
                                    _.map(_.map(data?.data?.events, (event) => new PossibleSolution(event)), (solution) =>
                                        <TableRow key={`${solution.id}-row`}>
                                            <CustomTableCell key={`${solution.id}-solution`}>
                                                {solution.solution}
                                            </CustomTableCell>
                                            <CustomNestingTableCell key={`${solution.id}-actions`} colSpan={5} style={{padding: 0}}>
                                                <ActionTable solution={solution}/>
                                            </CustomNestingTableCell>
                                        </TableRow>)
                                }
                            </TableBody>
                        </CustomNestedTable>
                }
            </div>
                <div style={{padding: 5}}>
                    <Button onClick={_=>setAddSolutionOpen(true)}>Add Solution</Button>
                </div>
            {
                addSolutionOpen && <SolutionsDialog onUpdate={refetch} gap={gap}  onClose={_=>setAddSolutionOpen(false)} />
            }
        </div>
    )
}
