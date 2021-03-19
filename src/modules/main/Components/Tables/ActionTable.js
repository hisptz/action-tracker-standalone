import {
    CustomNestedTable,
    CustomTableCell,
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
import {LiveColumnState} from "../../../../core/states/column";


const actionsQuery = {
    actions: {
        resource: 'trackedEntityInstances',
        params: ({ou, solutionToActionLinkage}) => ({
            program: 'unD7wro3qPm',
            ou,
            fields: [
                'trackedEntityInstance',
                'attributes[attribute,value]',
                'enrollments[events[trackedEntityInstance,eventDate,programStage,event,dataValues[dataElement,value]]]'
            ],
            filter: [
                `${SOLUTION_ACTION_LINKAGE}:eq:${solutionToActionLinkage}`
            ]
        })
    }
}

export default function ActionTable({solution = new PossibleSolution()}) {
    const {orgUnit} = useRecoilValue(DimensionsState);
    const {columns, actionsTable, visibleColumnsCount} = useRecoilValue(LiveColumnState);
    const [addActionOpen, setAddActionOpen] = useState(false)
    const {loading, data, error, refetch} = useDataQuery(actionsQuery, {
        variables: {
            ou: orgUnit?.id,
            solutionToActionLinkage: solution.actionLinkage
        }
    });

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
                                    _.isEmpty(data.actions.trackedEntityInstances) ?
                                        <TableRow><CustomTableCell><CenteredContent><p
                                            key={`${solution.id}-empty-actions`}> There are no actions for this
                                            solution</p>
                                        </CenteredContent></CustomTableCell></TableRow> :
                                        _.map(_.map(data.actions.trackedEntityInstances, (trackedEntityInstance) => new Action(trackedEntityInstance)), (action) =>
                                            <TableRow key={`${action.id}-row`}>
                                                {
                                                    _.map(actionsTable, (columnName) => {
                                                        const {render, visible} = _.find(columns, ['name', columnName]) || {};
                                                        if(render && visible) return render(action, refetch);
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
            <div style={{padding: 5}}>
                <Button onClick={_ => setAddActionOpen(true)}>Add Action Item</Button>
            </div>
            {
                addActionOpen &&
                <ActionItemDialog solution={solution} onUpdate={refetch} onClose={_ => setAddActionOpen(false)}/>
            }
        </div>
    )
}
