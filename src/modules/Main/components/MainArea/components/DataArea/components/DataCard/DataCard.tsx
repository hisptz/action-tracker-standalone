import React, { useMemo } from 'react'
import { ButtonStrip, Card } from '@dhis2/ui'
import { getAttributeValueFromList } from '../../../../../../../../shared/utils/metadata'
import { find, head } from 'lodash'
import { DataTable } from './components/DataTable'
import { DataTableHead } from './components/DataTable/components/DataTableHead'
import classes from './DataCard.module.css'
import { useColumns } from './hooks/columns'
import { ActionButton } from '../../../../../../../../shared/components/ActionButton'
import { Form } from '../../../../../../../../shared/components/Form'
import { useBoolean, useElementSize } from 'usehooks-ts'
import { useDeleteInstance } from '../../../../../../../../shared/components/Form/hooks/save'
import { useConfirmDialog } from '@hisptz/dhis2-ui'
import i18n from '@dhis2/d2-i18n'

export interface DataCardProps {
    data: any;
    instanceConfig: any;
    refetch: () => void;
}

export function DataCard ({
                              data,
                              instanceConfig,
                              refetch
                          }: DataCardProps) {
    const [ref, { width }] = useElementSize()
    const { confirm } = useConfirmDialog()
    const title = useMemo(() => {
        const headerId = find(instanceConfig.fields, (field: any) => field.header)?.id
        return getAttributeValueFromList(headerId, data.attributes)
    }, [data])
    const columns = useColumns()
    const {
        value: hide,
        setTrue: onHide,
        setFalse: onShow
    } = useBoolean(true)
    const { onDelete } = useDeleteInstance('program', { instanceName: instanceConfig.name })
    const onDeleteInstance = () => {
        confirm({
            title: i18n.t('Confirm Delete'),
            message: i18n.t('Are you sure you want to delete {{title}} and all related data?', {
                title
            }),
            onConfirm: async () => {
                await onDelete(head(data.enrollments))
                refetch()
            },
            onCancel: () => {
            },
        })
    }

    return (
        <>
            <Form
                onSaveComplete={refetch}
                defaultValue={data}
                instanceName={instanceConfig.name}
                id={instanceConfig.id}
                type="program"
                hide={hide}
                onClose={onHide}
            />
            <Card>
                <div className="p-16 column gap-16 h-100 w-100">
                    <div className="row space-between align-center">
                        <h2 style={{ margin: 0 }}>{title}</h2>
                        <ButtonStrip>
                            <ActionButton onDelete={onDeleteInstance} onEdit={onShow}/>
                        </ButtonStrip>
                    </div>
                    <div ref={ref} className="column w-100" style={{
                        flex: 1,
                        maxWidth: '100%',
                        overflowX: 'auto'
                    }}>
                        <table className={classes.table}>
                            <DataTableHead/>
                            <tbody style={{
                                margin: 0,
                                padding: 0
                            }}>
                            <tr>
                                <td style={{
                                    padding: 0,
                                    margin: 0
                                }} colSpan={columns.length}>
                                    <DataTable instance={data} parentType="program" parentConfig={instanceConfig}/>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </Card>
        </>
    )
}
