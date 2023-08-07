import React, { useState } from 'react'
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
    TableRowHead,
    Tooltip
} from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import { ActionButton } from '../../../../../../shared/components/ActionButton'
import { ColorView } from './components/ColorView'
import { DHIS2Icon } from '../../../../../../shared/components/DHIS2Icon/DHIS2Icon'
import { Option, OptionSet } from '../../../../../../shared/types/dhis2'
import { OptionForm } from './components/OptionForm/OptionForm'

export function ActionStatusOptionsConfig () {
    const [selectedOption, setSelectedOption] = useState<Option | null>(null)
    const {
        options,
        optionSet,
        refetch,
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
        <>
            {
                selectedOption && (
                    <OptionForm
                        optionSet={optionSet as OptionSet}
                        refetch={refetch}
                        defaultValue={selectedOption}
                        hide={!selectedOption}
                        onClose={() => setSelectedOption(null)}
                    />)
            }
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
                        options?.map((option) => {
                            const {
                                id,
                                name,
                                code,
                                style
                            } = option
                            return (
                                <TableRow key={`${id}-row`}>
                                    <TableCell>
                                        {name}
                                    </TableCell>
                                    <TableCell>
                                        {code}
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip content={style.color}>
                                            <ColorView color={style.color}/>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip content={style.icon}>
                                            <DHIS2Icon iconName={style.icon} size={24} color={'#000'}/>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <ActionButton
                                            onEdit={() => {
                                                setSelectedOption(option)
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
        </>
    )
}
