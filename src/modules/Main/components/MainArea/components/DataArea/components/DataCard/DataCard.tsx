import React, {useMemo} from 'react';
import {ButtonStrip, Card, Table} from "@dhis2/ui"
import {getAttributeValueFromList} from "../../../../../../../../shared/utils/metadata";
import {find, head} from "lodash";
import {DataTable} from "./components/DataTable";
import {DataTableHead} from "./components/DataTable/components/DataTableHead";
import classes from "./DataCard.module.css"
import {useColumns} from "./hooks/columns";
import {ActionButton} from "../../../../../../../../shared/components/ActionButton";
import {Form} from "../../../../../../../../shared/components/Form";
import {useBoolean} from "usehooks-ts";

export interface DataCardProps {
    data: any;
    instanceConfig: any;
    refetch: () => void;
}

export function DataCard({data, instanceConfig, refetch}: DataCardProps) {
    const title = useMemo(() => {
        const headerId = find(instanceConfig.fields, (field: any) => field.header)?.id;
        return getAttributeValueFromList(headerId, data.attributes);
    }, [data]);
    const columns = useColumns();
    const {value: hide, setTrue: onHide, setFalse: onShow} = useBoolean(true);

    return (
        <>
            <Form
                onSaveComplete={refetch}
                defaultValue={head(data.enrollments)}
                instanceName={instanceConfig.name}
                id={instanceConfig.id}
                type="program"
                hide={hide}
                onClose={onHide}
            />
            <Card>
                <div className="p-16 column gap-16 h-100 w-100">
                    <div className="row space-between align-center">
                        <h2 style={{margin: 0}}>{title}</h2>
                        <ButtonStrip>
                            <ActionButton onEdit={onShow}/>
                        </ButtonStrip>
                    </div>
                    <div className="column w-100" style={{flex: 1, maxWidth: "100%", overflowX: "auto"}}>
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
        </>
    )
}
