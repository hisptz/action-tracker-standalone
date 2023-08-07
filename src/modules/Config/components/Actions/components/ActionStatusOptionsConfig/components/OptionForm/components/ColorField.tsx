import { colors, Field, Input, Popover } from '@dhis2/ui'
import React, { useRef } from 'react'
import { Controller } from 'react-hook-form'
import { SketchPicker } from 'react-color'
import { useBoolean } from 'usehooks-ts'

export interface ColorFieldProps {
    name: string;
    label: string;
    onChange: (value: string) => void,
    value: string;

    [key: string]: any
}

function ColorPickerPopper ({
                                reference,
                                value,
                                onClose,
                                onChange
                            }: {
    reference: HTMLDivElement,
    value: string;
    onClose: () => void,
    onChange: (value: string) => void
}) {
    return (
        <Popover
            reference={reference}
            placement="auto"
            strategy="fixed"
            className="popper"
            onClickOutside={onClose}
        >
            <SketchPicker
                color={`${value}`}

                onChange={color => {
                    onChange(color.hex)
                    onClose()
                }}
            />
        </Popover>
    )
}

export function ColorField ({
                                name,
                                label,
                                onChange,
                                value,
                                ...props
                            }: ColorFieldProps) {
    const ref = useRef<HTMLDivElement>(null)
    const {
        value: popperOpen,
        setTrue: openPopper,
        setFalse: closePopper
    } = useBoolean(false)

    const onSelect = (value: string) => {
        closePopper()
        onChange(value)
    }

    return (
        <>
            {
                popperOpen && ref.current ? (
                    <ColorPickerPopper reference={ref.current} value={value} onClose={closePopper}
                                       onChange={onSelect}/>) : null
            }
            <Field
                {...props}
                label={label}>
                <div className="row gap-16">
                    <div role="button" onClick={openPopper} className="flex-1">
                        <Input value={value} disabled/>
                    </div>
                    <div onClick={openPopper} role="button" ref={ref} style={{
                        height: 40,
                        width: 40,
                        background: value,
                        border: `1px solid ${colors.grey400}`,
                        borderRadius: 4
                    }}>
                    </div>
                </div>
            </Field>
        </>
    )

}

export interface RHFColorFieldProps {
    name: string;
    label: string;

    [key: string]: any
}

export function RHFColorField ({
                                   name,
                                   label,
                                   ...props
                               }: RHFColorFieldProps) {

    return (
        <Controller
            name={name}
            render={({
                         field,
                         fieldState
                     }) => {
                return <ColorField
                    {...field}
                    label={label}
                    validationText={fieldState.error?.message}
                    error={!!fieldState.error}
                    {...props}
                    name={name}
                />
            }}
        />
    )
}
