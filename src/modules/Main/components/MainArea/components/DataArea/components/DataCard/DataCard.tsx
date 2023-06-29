import React, {useMemo} from 'react';
import {Box, Button, ButtonStrip, Card, IconMore24, Table} from "@dhis2/ui"
import {getAttributeValueFromList} from "../../../../../../../../shared/utils/metadata";
import {find} from "lodash";
import {DataTable} from "./components/DataTable";
import {DataTableHead} from "./components/DataTable/components/DataTableHead";
import classes from "./DataCard.module.css"
import {useColumns, useSetColumnState} from "./hooks/columns";

export interface DataCardProps {
    data: any;
    instanceConfig: any;
}

export function DataCard({data, instanceConfig}: DataCardProps) {
    useSetColumnState();
    const title = useMemo(() => {
        const headerId = find(instanceConfig.fields, (field: any) => field.header)?.id;
        return getAttributeValueFromList(headerId, data.attributes);
    }, [data]);

    const columns = useColumns()

    return (
        <Box height="600px" width="100%">
            <Card>
                <div className="p-16 column gap-16 h-100">
                    <div className="row space-between align-center">
                        <h2 style={{margin: 0}}>{title}</h2>
                        <ButtonStrip>
                            <Button icon={<IconMore24/>}/>
                        </ButtonStrip>
                    </div>
                    <div style={{flex: 1}}>
                        <Table className={classes.table}>
                            <DataTableHead/>
                            <tbody>
                            <tr>
                                <td colSpan={columns.length}>
                                    <DataTable instance={data} parentType="program" parentConfig={instanceConfig}/>
                                </td>
                            </tr>
                            </tbody>
                        </Table>
                    </div>
                </div>
            </Card>
        </Box>
    )
}
