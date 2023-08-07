import { colors, Field, Input } from '@dhis2/ui'
import React from 'react'
import { useBoolean } from 'usehooks-ts'
import { IconsSelectorModal } from '../../../../../../../../../shared/components/IconSelector'
import { Controller } from 'react-hook-form'
import { DHIS2Icon } from '../../../../../../../../../shared/components/DHIS2Icon/DHIS2Icon'

export interface IconFieldProps {
    name: string;
    label: string;
    onChange: (value: string) => void;
    value: string;

    [key: string]: any
}

export function IconField ({
                               name,
                               onChange,
                               value,
                               label,
                               ...props
                           }: IconFieldProps) {
    const {
        value: hide,
        setTrue: onHide,
        setFalse: onShow
    } = useBoolean(true)

    return (
        <>
            <IconsSelectorModal hide={hide} onClose={onHide} onUpdate={onChange} initialSelectedIcon={value}/>
            <Field
                {...props}
                label={label}>
                <div className="row gap-16">
                    <div role="button" onClick={onShow} className="flex-1">
                        <Input value={value} disabled/>
                    </div>
                    <div className="column align-center center" onClick={onShow} role="button" style={{
                        height: 40,
                        width: 40,
                        background: value,
                        border: `1px solid ${colors.grey400}`,
                        borderRadius: 4
                    }}>
                        <DHIS2Icon iconName={value} size={36} color={'#000'}/>
                    </div>
                </div>
            </Field>
        </>
    )
}

export interface RHFIconFieldProps {
    name: string;
    label: string;

    [key: string]: any
}

export function RHFIconField ({
                                  name,
                                  ...props
                              }: RHFIconFieldProps) {
    return (
        <Controller render={
            ({
                 field,
                 fieldState
             }) => {
                return (<IconField {...field} {...props} error={!!fieldState.error}
                                   validationText={fieldState.error?.message}/>)
            }
        } name={name}/>
    )
}
