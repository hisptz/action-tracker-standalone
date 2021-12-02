;
import React, {useEffect} from 'react'
import {DataTable, DataTableBody, DataTableCell, DataTableColumnHeader, DataTableHead, DataTableRow,} from '@dhis2/ui'
import Bottleneck from "../../../../core/models/bottleneck";
import Action from "../../../../core/models/action";
import {filter, find} from 'lodash'
import classes from './Download.module.css'
import {useRecoilValue, useRecoilValueLoadable} from "recoil";
import {ActionStatusState} from "../../../../core/states";
import {DownloadedData} from "./state/download";

const columns = ["General Activity", "Specific Activity", "Task", "Start Date", "End Date", "Status"]

const columnWidth = 100 / 6

export default function Download({downloadRef, onDownload}) {
    const statusLegend = useRecoilValue(ActionStatusState);
    const dataState = useRecoilValueLoadable(DownloadedData)


    useEffect(() => {
        if (dataState.state === 'hasValue') {
            onDownload()
        }
    }, [dataState.state]);


    if (dataState.state === 'loading') {
        return <div style={{display: 'none'}}>Loading...</div>
    }

    const data = dataState.contents

    return (
        dataState.state === 'hasValue' ? <div ref={downloadRef} className={classes["print-area"]} style={{padding: 16}}>
            {
                data.map(({bottleneck: intervention, actions}) => {
                    const bottleneck = new Bottleneck(intervention)
                    return (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 16,
                            pageBreakAfter: 'always',
                            pageBreakInside: 'avoid'
                        }}>
                            <h3>{bottleneck.intervention}</h3>
                            <DataTable className={classes["table"]}>
                                <DataTableHead className={classes['thead']}>
                                    <DataTableRow>
                                        {
                                            columns.map((column, index) => (
                                                <DataTableColumnHeader className={classes['table-header-cell']}
                                                                       width={`${columnWidth}%`}
                                                                       key={`${index}-column-head`}>{column}</DataTableColumnHeader>
                                            ))
                                        }
                                    </DataTableRow>
                                </DataTableHead>
                                <DataTableBody>
                                    {
                                        bottleneck?.gaps?.map((gap, gapIndex) => (
                                            gap?.possibleSolutions?.map((solution, solutionIndex) => {
                                                const relatedActions = filter(actions, (action) => {
                                                    const modelAction = new Action(action)
                                                    return modelAction.actionToSolutionLinkage === solution.actionLinkage
                                                }).map(action => new Action(action))

                                                return relatedActions?.map((action, actionIndex) => {
                                                    const selectedLegend = find(statusLegend, {code: action.latestStatus})
                                                    return (
                                                        <DataTableRow>
                                                            {
                                                                (solutionIndex === 0 && actionIndex === 0) ?
                                                                    <DataTableCell
                                                                        className={classes["table-row"]}
                                                                        width={`${columnWidth}%`}>
                                                                        {gap.title}
                                                                    </DataTableCell> : <DataTableCell className={classes["table-row"]} />

                                                            }
                                                            {
                                                                actionIndex === 0 ?
                                                                    <DataTableCell
                                                                        className={classes["table-row"]}
                                                                        width={`${columnWidth}%`}>
                                                                        {solution.solution}
                                                                    </DataTableCell> : <DataTableCell className={classes["table-row"]} />
                                                            }
                                                            <DataTableCell
                                                                className={classes["table-row"]}
                                                                width={`${columnWidth}%`}>
                                                                {action.title}
                                                            </DataTableCell>
                                                            <DataTableCell
                                                                className={classes["table-row"]}
                                                                width={`${columnWidth}%`}>
                                                                {action.startDate}
                                                            </DataTableCell>
                                                            <DataTableCell
                                                                className={classes["table-row"]}
                                                                width={`${columnWidth}%`}>
                                                                {action.endDate}
                                                            </DataTableCell>
                                                            <td style={{background: selectedLegend?.style?.color}}
                                                                className={classes["table-cell"]}
                                                                width={`${columnWidth}%`}>
                                                                {action.latestStatus}
                                                            </td>
                                                        </DataTableRow>
                                                    )
                                                })

                                            })
                                        ))
                                    }
                                </DataTableBody>
                            </DataTable>
                        </div>
                    )
                })
            }
        </div> : null
    )
}
