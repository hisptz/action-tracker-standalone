import {
    CustomNestedTable,
    CustomTableCell,
    DueDateTableCell,
    StatusTableCell
} from "./CustomTable";
import {TableBody, TableRow} from "@material-ui/core";
import _ from "lodash";
import React from "react";
import Action from "../../../../core/models/action";
import {useRecoilValue} from "recoil";
import {DimensionsState} from "../../../../core/states";
import {useDataQuery} from "@dhis2/app-runtime";
import {CenteredContent, CircularLoader} from "@dhis2/ui";


const ACTION_TO_SOLUTION_LINKAGE = 'Hi3IjyMXzeW';

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
                `${ACTION_TO_SOLUTION_LINKAGE}:eq:${solutionToActionLinkage}`
            ]
        })
    }
}

export default function ActionTable({solutionLinkage}) {
    const {orgUnit} = useRecoilValue(DimensionsState);
    const {loading, data, error} = useDataQuery(actionsQuery, {
        variables: {
            ou: orgUnit?.id,
            solutionToActionLinkage: solutionLinkage
        }
    });
    const styles = {
        container: {height: 200, overflow: 'auto'}
    }
    return (
        <div style={styles.container}>
            <CustomNestedTable>
                <colgroup>
                    <col width='15%'/>
                    <col width='15%'/>
                    <col width='12%'/>
                    <col width='12%'/>
                    <col width='15%'/>
                </colgroup>
                <TableBody>
                    {
                        loading && <CenteredContent><CircularLoader small/></CenteredContent>
                    }
                    {
                        error && <CenteredContent>{error.message || error.toString()}</CenteredContent>
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
                                        </TableRow>)
                            }
                        </>
                    }
                </TableBody>
            </CustomNestedTable>
        </div>
    )
}
