import React, { useMemo, useState } from 'react'
import { useFieldArray } from 'react-hook-form'
import {
    DropdownButton,
    FlyoutMenu,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableHead,
    TableRow,
    TableRowHead
} from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import { useBoolean } from 'usehooks-ts'
import { capitalize, findIndex } from 'lodash'
import { DataItemManageForm } from './DataItemManageForm'
import { DataItemSelect } from './DataItemSelect'
import { DataField } from '../schemas/config'
import { ActionButton } from './ActionButton'

export interface FieldTableProps {
    namespace: string;
    type: 'dataElement' | 'attribute',
    rules?: Record<string, any>
}

export function FieldTable ({
                                namespace,
                                type,
                                rules
                            }: FieldTableProps) {
    const {
        value: menuOpen,
        setFalse: closeMenu,
        toggle: toggleMenu
    } = useBoolean(false)
    const {
        value: hideSelect,
        setTrue: onHideSelect,
        setFalse: onShowSelect
    } = useBoolean(true)
    const {
        value: hideCreate,
        setTrue: onHideCreate,
        setFalse: onShowCreate
    } = useBoolean(true)
    const {
        fields,
        update,
        append
    } = useFieldArray({
        name: `${namespace}.fields`,
        keyName: 'key',
        rules
    })
    const [updatingField, setUpdatingField] = useState<DataField | null>(null)
    const fieldIds = useMemo(() => fields.map(({ id }: any) => id), [fields])
    const onMenuSelect = (type: 'new' | 'existing') => () => {
        closeMenu()
        if (type === 'existing') {
            onShowSelect()
        } else {
            onShowCreate()
        }
    }
    const onFieldAdd = (newField: DataField) => {
        const dataIndex = findIndex(fields as unknown as DataField[], { id: newField.id })
        if (dataIndex >= 0) {
            update(dataIndex, newField)
        } else {
            append(newField)
        }
        setUpdatingField(null)
    }
    const onCloseClick = () => {
        setUpdatingField(null)
        onHideCreate()
    }

    const fieldShowType = type === 'dataElement' ? 'column' : 'header'

    return (
        <>
            {
                !hideCreate && (
                    <DataItemManageForm defaultValue={updatingField} hide={hideCreate} type={type} onClose={onCloseClick}
                                        onAdd={onFieldAdd}/>)
            }
            <DataItemSelect onAdd={onFieldAdd} key={`${namespace}-select-field`} filtered={fieldIds} type={type}
                            hide={hideSelect}
                            onClose={onHideSelect}/>
            <div className="column gap-16">
                <Table>
                    <TableHead>
                        <TableRowHead>
                            <TableCellHead>{i18n.t('Name')}</TableCellHead>
                            <TableCellHead>{i18n.t('Type')}</TableCellHead>
                            <TableCellHead>{i18n.t('Required')}</TableCellHead>
                            <TableCellHead>{i18n.t('Show as {{ type }}', { type: fieldShowType })}</TableCellHead>
                            <TableCellHead>{i18n.t('Actions')}</TableCellHead>

                        </TableRowHead>
                    </TableHead>
                    <TableBody>
                        {fields.map((field: any, index) => (
                            <TableRow key={field.key}>
                                <TableCell>{field.name}</TableCell>
                                <TableCell>{capitalize(field.type.replaceAll(/_/g, ' '))}</TableCell>
                                <TableCell>{field.mandatory ? i18n.t('Yes') : i18n.t('No')}</TableCell>
                                <TableCell>{field.showAsColumn ? i18n.t('Yes') : i18n.t('No')}</TableCell>
                                <TableCell>
                                    <ActionButton
                                        onEdit={() => {
                                            setUpdatingField(field)
                                            onShowCreate()
                                        }}
                                        onDelete={() => {

                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div style={{ justifyContent: 'flex-end' }} className="row">
                    <DropdownButton
                        open={menuOpen} onClick={toggleMenu}
                        component={
                            <FlyoutMenu>
                                <MenuItem onClick={onMenuSelect('existing')}
                                          label={i18n.t('Add field from existing metadata')}/>
                                <MenuItem onClick={onMenuSelect('new')} label={i18n.t('Add new field')}/>

                            </FlyoutMenu>
                        }
                    >{i18n.t('Add field')}
                    </DropdownButton>
                </div>
            </div>
        </>
    )
}
