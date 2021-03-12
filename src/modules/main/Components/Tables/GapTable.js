import {CustomNestedTable, CustomNestingTableCell, CustomTableCell, CustomTableFooter} from "./CustomTable";
import {TableBody, TableRow} from "@material-ui/core";
import _ from "lodash";
import React from "react";
import SolutionsTable from "./SolutionsTable";
import {Button} from "@dhis2/ui";
import Gap from "../../../../core/models/gap";


export default function GapTable({gaps=[new Gap()]}) {
    return (
        <div style={{height: 420, overflow: 'auto'}}>
            <CustomNestedTable>
                <colgroup>
                    <col width='15%'/>
                </colgroup>
                <TableBody>
                    {
                        _.map(gaps, (gap) => <TableRow>
                            <CustomTableCell>
                                {gap.description}
                            </CustomTableCell>
                            <CustomNestingTableCell colSpan={6} style={{padding: 0}}>
                                {
                                    !_.isEmpty(gap.possibleSolutions) &&  <SolutionsTable solutions={gap.possibleSolutions}/>
                                }
                                <CustomTableFooter >
                                    <div style={{padding: 5}}>
                                        <Button>Add Solution</Button>
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
