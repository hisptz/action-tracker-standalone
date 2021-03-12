import {CustomNestedTable, CustomNestingTableCell, CustomTableCell, CustomTableFooter} from "./CustomTable";
import {TableBody, TableRow} from "@material-ui/core";
import _ from "lodash";
import React from "react";
import {Button} from "@dhis2/ui";
import ActionTable from "./ActionTable";
import PossibleSolution from "../../../../core/models/possibleSolution";



export default function SolutionsTable({solutions=[new PossibleSolution()]}){

    return(
        <div style={{height: 350, overflow: 'auto'}}>
            <CustomNestedTable>
                <colgroup>
                    <col width='18%'/>
                </colgroup>
                <TableBody>
                    {
                        _.map(solutions, (solution) => <TableRow>
                            <CustomTableCell>
                                {solution.solution}
                            </CustomTableCell>
                            <CustomNestingTableCell colSpan={5} style={{padding: 0}}>
                                <ActionTable solutionLinkage={solution.actionLinkage} />
                                <CustomTableFooter >
                                    <div style={{padding: 5}}>
                                        <Button>Add Action Item</Button>
                                    </div>
                                </CustomTableFooter>
                            </CustomNestingTableCell>
                        </TableRow>)
                    }
                </TableBody>
            </CustomNestedTable>
        </div>
    )
}
