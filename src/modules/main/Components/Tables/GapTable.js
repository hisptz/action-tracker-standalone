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
import generateErrorAlert from "../../../../core/services/generateErrorAlert";
import ChallengeDialog from "../../../../shared/Dialogs/ChallengeDialog";
import Bottleneck from "../../../../core/models/bottleneck";
import {useRecoilValue} from "recoil";
import {LiveColumnState} from "../../../../core/states/column";
import {GapConstants} from "../../../../core/constants";

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
    const {columns, gapsTable, visibleColumnsCount} = useRecoilValue(LiveColumnState);
    const [pageSize, setPageSize] = useState(5);
    const {loading, error, data, refetch} = useDataQuery(gapQuery, {
        variables: {
            trackedEntityInstance: challenge.id,
            page,
            pageSize
        }
    })
    const [addGapOpen, setAddGapOpen] = useState(false)
    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}))
    useEffect(() => generateErrorAlert(show, error), [error])

    return (
        <div>
            <div style={{height: 400, overflow: 'auto'}}>
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
                                                if(render && visible) return render(gap);
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
                                    <ChallengeDialog challenge={challenge} onClose={_ => setAddGapOpen(false)}
                                                     onUpdate={_ => refetch()}/>

                                }
                            </TableBody>
                        </CustomNestedTable>
                }
            </div>

            <div style={{padding: 5}}>
                <Button onClick={_ => setAddGapOpen(true)}>Add Gap</Button>
            </div>
        </div>
    )
}
