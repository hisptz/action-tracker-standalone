import React, { useMemo } from 'react'
import { Button, ButtonStrip, Card, IconChevronDown24, IconChevronUp24 } from '@dhis2/ui'
import { getAttributeValueFromList } from '../../../../../../../../shared/utils/metadata'
import { find, head } from 'lodash'
import { DataTable } from './components/DataTable'
import { DataTableHead } from './components/DataTable/components/DataTableHead'
import classes from './DataCard.module.css'
import { useColumns } from './hooks/columns'
import { ActionButton } from '../../../../../../../../shared/components/ActionButton'
import { Form } from '../../../../../../../../shared/components/Form'
import { useBoolean } from 'usehooks-ts'
import { useDeleteInstance } from '../../../../../../../../shared/components/Form/hooks/save'
import { useConfirmDialog } from '@hisptz/dhis2-ui'
import i18n from '@dhis2/d2-i18n'
import { useAccess } from '../../../../../../../../shared/components/AccessProvider/hooks/access'
import { useViewModal } from '../../../../../../../../shared/components/ViewModal'
import Collapsible from 'react-collapsible'
import { CategoryConfig, DataField } from '../../../../../../../../shared/schemas/config'
import { TrackedEntity } from '../../../../../../../../shared/types/dhis2'

export interface DataCardProps {
    index: number;
    data: any;
    instanceConfig: any;
    refetch: () => void;
}

function CardHeader ({
                         open,
                         instanceConfig,
                         data,
                         toggle,
                         refetch
                     }: {
    open: boolean,
    instanceConfig: CategoryConfig,
    data: TrackedEntity,
    refetch: () => void;
    toggle: () => void
}) {

    const { show } = useViewModal()

    const { confirm } = useConfirmDialog()
    const allowed = useAccess('Standalone Action Tracker - Planning')
    const title = useMemo(() => {
        const headerId = find(instanceConfig.fields as DataField[], (field: DataField) => field.header)?.id
        return getAttributeValueFromList(headerId, data.attributes)
    }, [data])
    const { onDelete } = useDeleteInstance('program', { instanceName: instanceConfig.name })

    const {
        value: hide,
        setTrue: onHide,
        setFalse: onShow
    } = useBoolean(true)
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
            <div className="row space-between align-center p-16">
                <h2 style={{ margin: 0 }}>{title}</h2>
                <ButtonStrip>
                    <Button onClick={toggle} small icon={open ? <IconChevronUp24/> : <IconChevronDown24/>}/>
                    <ActionButton
                        onDelete={allowed ? onDeleteInstance : undefined}
                        onEdit={allowed ? onShow : undefined}
                        onView={() => {
                            show({
                                instance: data,
                                instanceConfig: instanceConfig as any
                            })
                        }}
                    />
                </ButtonStrip>
            </div>
        </>
    )
}

export function DataCard ({
                              data,
                              instanceConfig,
                              refetch,
                              index
                          }: DataCardProps) {
    const {
        value: open,
        setTrue: onOpen,
        setFalse: onClose,
        toggle
    } = useBoolean(index === 0)
    const columns = useColumns()

    return (
        <>
            <Card>
                <Collapsible
                    name={`${data.trackedEntity}-collapsible`}
                    key={`${data.trackedEntity}-collapsible`}
                    triggerDisabled
                    onOpen={onOpen}
                    onClose={onClose}
                    open={open}
                    trigger={
                        <CardHeader
                            data={data}
                            instanceConfig={instanceConfig}
                            toggle={toggle}
                            open={open}
                            refetch={refetch}
                        />
                    }>
                    <div className="p-16 column gap-16 h-100 w-100">
                        <div className="column w-100" style={{
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
                </Collapsible>
            </Card>
        </>
    )
}
