import {ActionConfig, CategoryConfig} from "../../../../../../../../../../shared/schemas/config";
import React, {useMemo} from "react";
import {useConfiguration} from "../../../../../../../../../../shared/hooks/config";
import {useTableData} from "./hooks/data";
import {Button, CircularLoader, IconAdd24, Pagination, TableBody, TableCell, TableFoot, TableRow} from "@dhis2/ui"
import i18n from '@dhis2/d2-i18n';
import {Form} from "../../../../../../../../../../shared/components/Form";
import {useBoolean} from "usehooks-ts";
import {get} from "lodash";

export interface DataTableProps {
    config: ActionConfig | CategoryConfig;
    instance: any;
    parentType: "program" | "programStage"
}


export function DataTable({config: parentConfig, instance: parentInstance, parentType}: DataTableProps) {
    const {child} = parentConfig
    const {config: allConfig} = useConfiguration();
    const config = useMemo(() => {
        if (child.type === "program") {
            //Only the action program can be a child
            return allConfig?.action as ActionConfig;
        }
        const categoryConfig = allConfig?.categories?.find((category) => category.id === child.to);
        if (categoryConfig) {
            return categoryConfig as CategoryConfig;
        }
    }, [child]);

    const {loading, noData, refetch, rows, columns, pagination} = useTableData(child.type, {parentInstance, config});

    const instanceType = useMemo(() => config?.name?.toLowerCase() ?? "", [config]);
    const {value: hide, setTrue: onHide, setFalse: onShow} = useBoolean(true);

    const parent = useMemo(() => {
        if (parentType === "programStage") {
            return {
                id: parentInstance?.event
            }
        } else {
            return {
                id: get(parentInstance, ['enrollments', 0, 'enrollment'])
            }
        }
    }, []);
    const onComplete = () => {
        refetch();
    }

    if (loading) {
        return (
            <tbody>
            <tr>
                <td colSpan={columns?.length}>
                    <div style={{minHeight: "100px"}} className="column center align-center w-100 h-100">
                        <CircularLoader small/>
                    </div>
                </td>
            </tr>
            </tbody>
        )
    }

    if (noData) {
        return (
            <>
                <Form onSaveComplete={onComplete}
                      id={config?.id as string} hide={hide} type={child.type}
                      onClose={onHide}
                      instanceName={instanceType} parent={parent} parentConfig={config?.parent}/>
                <tbody>
                <tr>
                    <td colSpan={columns?.length}>
                        <div style={{minHeight: "100px"}} className="column center align-center w-100 h-100 gap-16">
                            {i18n.t("There are no recorded {{ instanceType }}. Click on the button below to create one", {
                                instanceType
                            })}
                            <Button onClick={onShow} icon={<IconAdd24/>}>
                                {i18n.t("Add {{ instanceType }}", {
                                    instanceType
                                })}
                            </Button>
                        </div>
                    </td>
                </tr>
                </tbody>
            </>
        )
    }

    return (
        <>
            <Form onSaveComplete={onComplete}
                  id={config?.id as string} hide={hide} type={child.type}
                  onClose={onHide}
                  instanceName={instanceType} parent={parent} parentConfig={config?.parent}/>
            <TableBody>
                {
                    rows?.map((row, index) => (
                        <TableRow key={`${row.id}-${index}`}>
                            {
                                columns.map((column, columnIndex) => (
                                    <TableCell key={`${row.id}-${column.id}-${columnIndex}`}>
                                        {get(row, [column.id], '')}
                                    </TableCell>
                                ))
                            }
                        </TableRow>
                    ))
                }
            </TableBody>
            <TableFoot>
                <tr>
                    <td style={{padding: 8}} colSpan={columns?.length}>
                        <div className="row gap-16 space-between">
                            <Button onClick={onShow}
                                    icon={<IconAdd24/>}>{i18n.t("Add {{instanceType}}", {instanceType})}</Button>
                            <Pagination {...pagination}/>
                        </div>
                    </td>
                </tr>
            </TableFoot>
        </>
    )
}
