import React from 'react'
import { useStatusOptions } from './hooks/data'
import {
    CircularLoader,
    IconError24,
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableHead,
    TableRow,
    TableRowHead
} from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import { ActionButton } from '../../../../../../shared/components/ActionButton'

export function ActionStatusOptionsConfig () {
    const {
        options,
        loading,
        error
    } = useStatusOptions()

    if (loading) {
        return (
            <div style={{
                width: '100%',
                height: 300
            }} className="column gap-8 align-center center">
                <CircularLoader small/>
            </div>
        )
    }

    if (error) {
        return (
            <div
                style={{
                    width: '100%',
                    height: 300
                }}
                className="column gap-8 align-center center">
                <IconError24/>,
                <h4>{i18n.t('Error obtaining action status options')}</h4>
                <code>{error.message}</code>
            </div>
        )
    }

    return (
        <Table>
            <TableHead>
                <TableRowHead>
                    <TableCellHead>{i18n.t('Name')}</TableCellHead>
                    <TableCellHead>{i18n.t('Code')}</TableCellHead>
                    <TableCellHead>{i18n.t('Color')}</TableCellHead>
                    <TableCellHead>{i18n.t('Icon')}</TableCellHead>
                    <TableCellHead>{i18n.t('Actions')}</TableCellHead>
                </TableRowHead>
            </TableHead>
            <TableBody>
                {
                    options?.map(({
                                      id,
                                      name,
                                      code,
                                      style
                                  }) => {

                        return (
                            <TableRow key={`${id}-row`}>
                                <TableCell>
                                    {name}
                                </TableCell>
                                <TableCell>
                                    {code}
                                </TableCell>
                                <TableCell>
                                    {style.color}
                                </TableCell>
                                <TableCell>
                                    {style.icon}
                                </TableCell>
                                <TableCell>
                                    <ActionButton
                                        onEdit={() => {
                                        }}
                                        onDelete={() => {
                                        }}/>
                                </TableCell>
                            </TableRow>
                        )
                    })
                }
            </TableBody>
        </Table>
    )
}
