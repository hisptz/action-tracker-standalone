import {
    CustomNestedTable,
    CustomTableCell, CustomTableFooter,
    DueDateTableCell,
    StatusTableCell
} from "./CustomTable";
import {TableBody, TableRow} from "@material-ui/core";
import _ from "lodash";
import React, {useState} from "react";
import Action from "../../../../core/models/action";
import {useRecoilValue} from "recoil";
import {DimensionsState} from "../../../../core/states";
import {useDataQuery} from "@dhis2/app-runtime";
import {Button, CenteredContent, CircularLoader} from "@dhis2/ui";
import ActionItemDialog from "../../../../shared/Dialogs/ActionItemDialog";
import PossibleSolution from "../../../../core/models/possibleSolution";
import {SOLUTION_ACTION_LINKAGE} from "../../../../core/constants";


const actionsQuery = {
    actions: {
        resource: 'trackedEntityInstances',
        params: ({ou, solutionToActionLinkage}) => ({
            program: 'unD7wro3qPm',
            ou,
            fields: [
                'trackedEntityInstance',
                'attributes[attribute,value]',
                'enrollments[events[eventDate,programStage,event,dataValues[dataElement,value]]]'
            ],
            filter: [
                `${SOLUTION_ACTION_LINKAGE}:eq:${solutionToActionLinkage}`
            ]
        })
    }
}

export default function ActionTable({solution = new PossibleSolution()}) {
    const {orgUnit} = useRecoilValue(DimensionsState);
    const [addActionOpen, setAddActionOpen] = useState(false)
    const {loading, data, error, refetch} = useDataQuery(actionsQuery, {
        variables: {
            ou: orgUnit?.id,
            solutionToActionLinkage: solution.actionLinkage
        }
    });
    const styles = {
        container: {height: 200, overflow: 'auto'}
    }
    return (
        <div>
            <div style={styles.container}>
                <CustomNestedTable>
                    <colgroup >
                        {
                            [1,2,3,4,5].map(_=><col width={`${100/7}%`} />)
                        }
                    </colgroup>
                    <TableBody>
                        {
                            loading && <CenteredContent><CircularLoader small/></CenteredContent>
                        }
                        {
                            error && <CenteredContent>{error?.message || error.toString()}</CenteredContent>
                        }
                        {
                            data && <>
                                {
                                    _.isEmpty(data.actions.trackedEntityInstances) ?
                                        <p> Empty</p> :
                                        _.map(_.map(data.actions.trackedEntityInstances, (trackedEntityInstance) => new Action(trackedEntityInstance)), (action) =>
                                            <TableRow>
                                                <CustomTableCell>
                                                    {action?.description}
                                                </CustomTableCell>
                                                <CustomTableCell>
                                                    {action?.responsiblePerson}, {action?.designation}
                                                </CustomTableCell>
                                                <CustomTableCell>
                                                    {action?.startDate}
                                                </CustomTableCell>
                                                <DueDateTableCell dueDate={action?.endDate}/>
                                                <StatusTableCell status={action?.latestStatus}/>
                                            </TableRow>
                                        )
                                }
                            </>
                        }
                    </TableBody>
                </CustomNestedTable>
            </div>
            <CustomTableFooter>
                <div style={{padding: 5}}>
                    <Button onClick={_ => setAddActionOpen(true)}>Add Action Item</Button>
                </div>
            </CustomTableFooter>
            {
                addActionOpen && <ActionItemDialog solution={solution} onUpdate={refetch} onClose={_ => setAddActionOpen(false)}/>
            }
        </div>
    )
}
