import {ActionConfig, CategoryConfig} from "../../../../../../../../../../shared/schemas/config";
import React, {useMemo} from "react";
import {useConfiguration} from "../../../../../../../../../../shared/hooks/config";
import {useTableData} from "./hooks/data";
import {Button, CircularLoader, IconAdd24, TableBody, TableCell, TableRow} from "@dhis2/ui"
import i18n from '@dhis2/d2-i18n';
import {Form} from "../../../../../../../../../../shared/components/Form";
import {useBoolean} from "usehooks-ts";
import {get} from "lodash";
import {useTableColumns} from "./hooks/columns";
import classes from "./DataTable.module.css"

export interface DataTableProps {
    parentConfig: ActionConfig | CategoryConfig;
    instance: any;
    parentType: "program" | "programStage",
    nested?: boolean
}


export function DataTable({parentConfig, instance: parentInstance, parentType, nested}: DataTableProps) {
    const {child} = parentConfig as any
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
    }, [child, allConfig]);

    const {loading, noData, refetch, rows, pagination} = useTableData(child.type, {
        parentInstance,
        parentType
    });

    const instanceType = useMemo(() => config?.name?.toLowerCase() ?? "", [config]);
    const {value: hide, setTrue: onHide, setFalse: onShow} = useBoolean(true);

    const parent = useMemo(() => {
        if (parentType === "programStage") {
            return {
                id: parentInstance?.event,
                instance: parentInstance
            }
        } else {
            return {
                id: get(parentInstance, ['enrollments', 0, 'enrollment']),
                instance: parentInstance
            }
        }
    }, []);

    const {columns, allColumns, childTableColSpan} = useTableColumns(config as any);


    const onComplete = () => {
        refetch();
    }

    if (loading) {
        return (
            <table key={`loading`}>
                <tbody>
                <tr>
                    <td colSpan={columns?.length + childTableColSpan}>
                        <div style={{minHeight: "100px"}} className="column center align-center w-100 h-100">
                            <CircularLoader small/>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        )
    }

    if (noData) {
        return (
            <table className='w-100' key={`no-data`}>
                <Form onSaveComplete={onComplete}
                      id={config?.id as string} hide={hide} type={child?.type}
                      onClose={onHide}
                      instanceName={instanceType} parent={parent} parentConfig={config?.parent}/>
                <tbody>
                <tr>
                    <td colSpan={columns?.length + childTableColSpan}>
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
            </table>
        )
    }

    return (
        <div className="column w-100">
            <div style={{
                maxHeight: nested ? 500 : 800,
                overflowY: "auto"
            }}>
                <table style={{
                    padding: 0,
                    margin: 0,
                    borderSpacing: 0,
                    borderCollapse: "collapse",
                }}>
                    <colgroup>
                        {
                            columns?.map((header,) => (
                                <col width={header.width} key={`${header.id}-colgroup`}/>))
                        }
                    </colgroup>
                    <Form onSaveComplete={onComplete}
                          id={config?.id as string} hide={hide} type={child?.type}
                          onClose={onHide}
                          instanceName={instanceType} parent={parent} parentConfig={config?.parent}/>
                    <TableBody className={classes['table-body']}>
                        {
                            rows?.map((row, index) => (
                                <TableRow key={`${row.id}-${index}`}>
                                    {
                                        columns.map((column, columnIndex) => (
                                            <TableCell className={classes['value-cell']}
                                                       key={`${row.id}-${column.id}-${columnIndex}`}>
                                                {get(row, [column.id], '')}
                                            </TableCell>
                                        ))
                                    }
                                    {
                                        config?.child && (
                                            <TableCell className={classes['nesting-cell']} colSpan={`${childTableColSpan}`}
                                                       key={`${row.id}-child`}>
                                                <DataTable nested key={`${row.id}-child-table`} parentConfig={config}
                                                           instance={row.instance} parentType={child?.type}/>
                                            </TableCell>
                                        )
                                    }
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </table>
            </div>
            <div style={{padding: 8}} className="row gap-16 space-between">
                <Button onClick={onShow}
                        icon={<IconAdd24/>}>{i18n.t("Add {{instanceType}}", {instanceType})}</Button>
                {/*{//TODO: Allow pagination when total issues is fixed for relationships query}*/}
                {/*<Pagination {...pagination}/>*/}
            </div>
        </div>
    )
}
