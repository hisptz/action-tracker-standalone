import {CustomNestedTable, CustomNestingTableCell, CustomTableCell, CustomTableFooter} from "./CustomTable";
import {TableBody, TableRow} from "@material-ui/core";
import _ from "lodash";
import React from "react";
import SolutionsTable from "./SolutionsTable";
import {Button} from "@dhis2/ui";


export default function GapTable({gaps}) {

    return (
        <div style={{height: 420, overflow: 'auto'}}>
            <CustomNestedTable>
                <colgroup>
                    <col width='15%'/>
                </colgroup>
                <TableBody>
                    {
                        _.map(gaps, ({description, solutions}) => <TableRow>
                            <CustomTableCell>
                                {description}
                            </CustomTableCell>
                            <CustomNestingTableCell colSpan={6} style={{padding: 0}}>
                                <SolutionsTable solutions={solutions}/>
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
