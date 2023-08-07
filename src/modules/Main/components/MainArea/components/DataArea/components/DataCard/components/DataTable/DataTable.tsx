import { ActionConfig, CategoryConfig } from '../../../../../../../../../../shared/schemas/config'
import React, { useMemo, useState } from 'react'
import { useConfiguration } from '../../../../../../../../../../shared/hooks/config'
import { useTableData } from './hooks/data'
import { Button, CircularLoader, IconAdd24, Pagination, TableBody, TableCell, TableRow } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import { Form } from '../../../../../../../../../../shared/components/Form'
import { useBoolean } from 'usehooks-ts'
import { get } from 'lodash'
import { useTableColumns } from './hooks/columns'
import classes from './DataTable.module.css'
import { TrackingTable } from '../TrackingTable'
import { useTrackingColumns } from '../../hooks/columns'
import { ActionButton } from '../../../../../../../../../../shared/components/ActionButton'
import { useDeleteInstance } from '../../../../../../../../../../shared/components/Form/hooks/save'
import { useConfirmDialog } from '@hisptz/dhis2-ui'
import { useViewModal } from '../../../../../../../../../../shared/components/ViewModal'
import { DataView } from '../../../../../../../../../../shared/components/DataView/DataView'

export interface DataTableProps {
    parentConfig: ActionConfig | CategoryConfig;
    instance: any;
    parentType: 'program' | 'programStage',
    nested?: boolean
}

export function DataTable ({
                               parentConfig,
                               instance: parentInstance,
                               parentType,
                               nested
                           }: DataTableProps) {
    const { child } = parentConfig as any
    const { confirm } = useConfirmDialog()
    const { show } = useViewModal()

    const { config: allConfig } = useConfiguration()
    const config = useMemo(() => {
        if (child.type === 'program') {
            //Only the action program can be a child
            return allConfig?.action as ActionConfig
        }
        const categoryConfig = allConfig?.categories?.find((category) => category.id === child.to)
        if (categoryConfig) {
            return categoryConfig as CategoryConfig
        }
    }, [child, allConfig])
    const {
        loading,
        noData,
        refetch,
        rows,
        pagination
    } = useTableData(child.type, {
        parentInstance,
        parentType
    })
    const instanceType = useMemo(() => config?.name?.toLowerCase() ?? '', [config])
    const {
        value: hide,
        setTrue: onHide,
        setFalse: onShow
    } = useBoolean(true)

    const parent = useMemo(() => {
        if (parentType === 'programStage') {
            return {
                id: parentInstance?.event,
                instance: parentInstance
            }
        } else {
            return {
                id: get(parentInstance, ['trackedEntity']),
                instance: parentInstance
            }
        }
    }, [])

    const {
        columns,
        childTableColSpan
    } = useTableColumns(config as any)

    const trackingColumns = useTrackingColumns()

    const [editedInstance, setEditInstance] = useState()

    const { onDelete } = useDeleteInstance(child.type, { instanceName: config?.name as string })
    const onComplete = () => {
        refetch()
    }

    const title = config?.name

    const onDeleteClick = (instance: any) => {
        confirm({
            title: i18n.t('Confirm Delete'),
            message: i18n.t('Are you sure you want to delete this {{title}} and all related data?', {
                title
            }),
            onConfirm: async () => {
                await onDelete(instance)
                refetch()
            },
            onCancel: () => {
            },
        })
    }

    if (loading) {
        return (
            <table key={`loading`}>
                <tbody>
                <tr>
                    <td colSpan={columns?.length + childTableColSpan}>
                        <div style={{ minHeight: '100px' }} className="column center align-center w-100 h-100">
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
            <table className="w-100" key={`no-data`}>
                <Form onSaveComplete={onComplete}
                      id={config?.id as string} hide={hide} type={child?.type}
                      onClose={() => {
                          onHide()
                          setEditInstance(undefined)
                      }}
                      instanceName={instanceType} parent={parent} parentConfig={config?.parent}/>
                <tbody>
                <tr>
                    <td colSpan={columns?.length + childTableColSpan}>
                        <div style={{ minHeight: '100px' }} className="column center align-center w-100 h-100 gap-16">
                            {i18n.t('There are no recorded {{ instanceType }}. Click on the button below to create one', {
                                instanceType
                            })}
                            <Button onClick={onShow} icon={<IconAdd24/>}>
                                {i18n.t('Add {{ instanceType }}', {
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

    const calculateColumnWidth = (width: number) => {
        /*
        * I honestly wished you had seen the code I had written here. It was a masterpiece util it didn't work. But somehow a zero solves all problems. I wish someday I will know why
        *  */
        return 0
    }

    console.log(rows)

    return (
        <div className="column w-100">
            <div style={{
                maxHeight: nested ? 520 : 800,
                overflowY: 'auto'
            }}>
                <table style={{
                    tableLayout: 'fixed',
                    padding: 0,
                    margin: 0,
                    borderSpacing: 0,
                    borderCollapse: 'collapse',
                    width: '100%'
                }}>
                    {
                        columns?.map((header,) => (
                            <col id={header.id}
                                 width={`${calculateColumnWidth(header.width)}%`}
                                 key={`${header.id}-colgroup`}/>))
                    }
                    {
                        !hide && (
                            <Form
                                defaultValue={editedInstance}
                                onSaveComplete={onComplete}
                                id={config?.id as string} hide={hide} type={child?.type}
                                onClose={() => {
                                    onHide()
                                    setEditInstance(undefined)
                                }}
                                instanceName={instanceType} parent={parent} parentConfig={config?.parent}
                            />
                        )
                    }
                    <TableBody className={classes['table-body']}>
                        {
                            rows?.map((row, index) => (
                                <TableRow key={`${row.id}-${index}`}>
                                    {
                                        columns.map((column, columnIndex) => (
                                            columnIndex === columns.length - 1 ?
                                                <td
                                                    className={classes['value-cell']}
                                                    key={`${row.id}-${column.id}-${columnIndex}`}>
                                                    <div className="w-100 h-100 row gap-8 space-between">
                                                        <div className="flex-1 w-100 h-100 column center">
                                                            <DataView
                                                                fieldId={column.id}
                                                                instanceConfig={config as any}
                                                                value={get(row, [column.id], '')}
                                                            />
                                                        </div>
                                                        <div>
                                                            <ActionButton
                                                                onView={() => {
                                                                    show({
                                                                        instance: row.instance,
                                                                        instanceConfig: config as any
                                                                    })
                                                                }}
                                                                onEdit={() => {
                                                                    setEditInstance(row.instance)
                                                                    onShow()
                                                                }}
                                                                onDelete={() => onDeleteClick(row.instance)}
                                                            />
                                                        </div>
                                                    </div>
                                                </td> : <TableCell className={classes['value-cell']}
                                                                   key={`${row.id}-${column.id}-${columnIndex}`}>
                                                    {get(row, [column.id], '')}
                                                </TableCell>
                                        ))
                                    }
                                    {
                                        (config as any)?.child && (
                                            <TableCell className={classes['nesting-cell']} colSpan={`${childTableColSpan}`}
                                                       key={`${row.id}-child`}>
                                                <DataTable nested key={`${row.id}-child-table`} parentConfig={config as any}
                                                           instance={row.instance} parentType={child?.type}/>
                                            </TableCell>
                                        )
                                    }
                                    {
                                        child.type === 'program' && (
                                            <TableCell colSpan={`${trackingColumns.length}`}
                                                       className={classes['nesting-cell']}
                                                       key={`${row.id}-tracking-cell`}>
                                                <TrackingTable key={`${row.id}-tracking`}
                                                               actionConfig={config as ActionConfig}
                                                               instance={row.instance}/>
                                            </TableCell>
                                        )
                                    }
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </table>
            </div>
            <div style={{ padding: 8 }} className="row gap-16 space-between">
                <Button onClick={onShow}
                        icon={<IconAdd24/>}>{i18n.t('Add {{instanceType}}', { instanceType })}</Button>
                {
                    pagination.pageCount > 1 && (<Pagination {...pagination}/>)
                }
            </div>
        </div>
    )
}
