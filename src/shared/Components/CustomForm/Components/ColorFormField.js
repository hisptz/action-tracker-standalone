import {Field, Popover, Input} from '@dhis2/ui'
import Grid from "@material-ui/core/Grid";
import React, {useState} from 'react';
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import {SketchPicker} from "react-color";

function ColorPickerPopper({reference, value, onClose, onChange}) {
    return (
        <Popover
            reference={reference}
            placement='auto'
            strategy='fixed'
            className='popper'
            onClickOutside={onClose}
        >
            <SketchPicker
                color={{hex: value}}
                onChange={color => {
                    onChange(color.hex);
                    onClose();
                }}
            />
        </Popover>
    )
}

export default function ColorFormField({value, onChange, error, label, ...props}) {
    const [reference, setReference] = useState(undefined);
    return (
        <Field
            label={label}
            error={error}
            {...props}
        >
            <Grid container spacing={0} direction='row'>
                <Grid item sm={11}>
                    <div onClick={e => setReference(e.currentTarget)}>
                        <Input error={error} disabled={Boolean(reference)} value={value?.value}/>
                    </div>
                </Grid>
                <Grid item sm={1}>
                    <Box onClick={e => setReference(e.currentTarget)} component={Paper} elevation={0} width={40}
                         height={40} style={{backgroundColor: value?.value, border: '1px solid rgb(160,173,186)'}}/>
                </Grid>
                {
                    reference &&
                    <ColorPickerPopper onClose={_ => setReference(undefined)} reference={reference} value={value?.value}
                                       onChange={onChange}/>
                }
            </Grid>
        </Field>
    )
}


