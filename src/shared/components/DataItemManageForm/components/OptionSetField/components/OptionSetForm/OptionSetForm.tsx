import React, { useEffect, useMemo } from 'react'
import {
    Button,
    ButtonStrip,
    Field,
    IconDelete24,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableHead,
    TableRow,
    TableRowHead
} from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import { FormProvider, useFieldArray, useForm, useFormContext } from 'react-hook-form'
import { RHFSingleSelectField, RHFTextInputField } from '@hisptz/dhis2-ui'
import { useBoolean } from 'usehooks-ts'
import { capitalize, isEmpty } from 'lodash'
import classes from './OptionSetForm.module.css'
import { z } from 'zod'
import { useManageOptionSet } from './hooks/save'
import { uid } from '@hisptz/dhis2-utils'
import { SUPPORTED_VALUE_TYPES } from '../../../../../../constants/meta'
import { Option } from '../../../../../../types/dhis2'

function getFieldTypeByValueType (valueType: string) {
    switch (valueType) {
        case 'TEXT':
            return 'text'
        case 'INTEGER':
        case 'NUMBER':
            return 'number'
    }
}

function OptionForm ({
                         hide,
                         onClose,
                         onAdd,
                         selected,
                         valueType
                     }: {
    hide: boolean;
    onClose: () => void;
    selected?: string[]
    onAdd: (option: { name: string; code: string }) => void;
    valueType: string;
}) {
    const form = useForm<{ name: string; code: string }>({
        shouldFocusError: false
    })

    const onCloseClick = () => {
        form.reset()
        onClose()
    }

    const onSubmit = (data: { name: string; code: string }) => {
        onAdd(data)
        onCloseClick()
    }

    return (
        <Modal position="middle" onClose={onCloseClick} hide={hide} small>
            <ModalTitle>
                {i18n.t('Add option')}
            </ModalTitle>
            <ModalContent>
                <FormProvider {...form} >
                    <form className="column gap-16">
                        <RHFTextInputField required validations={{ required: i18n.t('Name is required') }} name={`name`}
                                           label={i18n.t('Name')}/>
                        <RHFTextInputField type={getFieldTypeByValueType(valueType)} required validations={{
                            required: i18n.t('Code is required'),
                            validate: {
                                exists: (value: string) => {
                                    if (selected?.includes(value)) {
                                        return i18n.t('This code already exists')
                                    }
                                    return true
                                }
                            }
                        }} name={`code`} label={i18n.t('Code')}/>
                    </form>
                </FormProvider>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onCloseClick}>{i18n.t('Cancel')}</Button>
                    <Button primary onClick={form.handleSubmit(onSubmit)}>{i18n.t('Add')}</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

function OptionsList ({ valueType }: { valueType: string }) {
    const {
        value: hide,
        setTrue: onHide,
        setFalse: onShow
    } = useBoolean(true)

    const { getFieldState } = useFormContext()
    const {
        fields,
        append,
        remove
    } = useFieldArray({
        name: 'options',
        rules: {
            required: i18n.t('At least two options are required'),
            minLength: {
                value: 2,
                message: i18n.t('At least two options are required')
            }
        }
    })
    const onFieldAdd = (option: { name: string; code: string }) => {
        append(option)
    }
    const codes = useMemo(() => fields.map(({ code }: any) => code as string), [fields])

    const { error } = getFieldState('options')

    return (
        <>
            <OptionForm valueType={valueType} selected={codes} hide={hide} onClose={onHide} onAdd={onFieldAdd}/>
            <Field error={!!error?.root} validationText={error?.root?.message} label={i18n.t('Options')}
                   name={`options`}>
                <div className="column gap-16">
                    {
                        !isEmpty(fields) && (
                            <Table className={classes.table}>
                                <col style={{ width: '40%' }}/>
                                <col style={{ width: '40%' }}/>
                                <col style={{ width: '20%' }}/>
                                <TableHead>
                                    <TableRowHead>
                                        <TableCellHead>
                                            {i18n.t('Name')}
                                        </TableCellHead>
                                        <TableCellHead>
                                            {i18n.t('Code')}
                                        </TableCellHead>
                                        <TableCellHead></TableCellHead>
                                    </TableRowHead>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <td style={{
                                            margin: 0,
                                            padding: 0
                                        }} colSpan={3}>
                                            <div className={classes['table-body']}>
                                                <table style={{
                                                    margin: 0,
                                                    padding: 0,
                                                    borderCollapse: 'collapse'
                                                }}
                                                       className="w-100">
                                                    <col style={{ width: '40%' }}/>
                                                    <col style={{ width: '40%' }}/>
                                                    <col style={{ width: '20%' }}/>
                                                    <tbody style={{
                                                        margin: 0,
                                                        padding: 0
                                                    }}>
                                                    {
                                                        fields?.map((option: any, index) => (
                                                            <TableRow key={`${option.id}`}>
                                                                <TableCell>
                                                                    {option.name}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {option.code}
                                                                </TableCell>
                                                                <TableCell dense>
                                                                    <Button small icon={<IconDelete24/>}
                                                                            onClick={() => remove(index)}/>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </td>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        )
                    }
                    <div>
                        <Button onClick={onShow}>
                            {i18n.t('Add option')}
                        </Button>
                    </div>
                </div>
            </Field>
        </>
    )
}

const OptionSetDataSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
    code: z.string(),
    valueType: z.string(),
    options: z.array(z.object({
        id: z.string().optional(),
        name: z.string(),
        code: z.string()
    }))
})

export type OptionSetData = z.infer<typeof OptionSetDataSchema>;

export interface OptionSetFormProps {
    valueType: string;
    defaultValue?: Option | null
    hide: boolean;
    onClose: () => void;
    onSave: (data: OptionSetData) => void;
}

export function OptionSetForm ({
                                   hide,
                                   onClose,
                                   onSave,
                                   valueType,
                                   defaultValue
                               }: OptionSetFormProps) {
    const {
        saving,
        saveOptionSet
    } = useManageOptionSet()
    const form = useForm<OptionSetData>({
        defaultValues: defaultValue ?? {}
    })
    const onCloseClick = () => {
        form.reset({})
        onClose()
    }
    const onSubmit = async (data: OptionSetData) => {
        const optionSetId = uid()
        const sanitizedOptionSetData = {
            id: optionSetId,
            ...data,
            options: data.options.map((option, index) => ({
                ...option,
                sortOrder: index + 1,
                id: uid(),
                optionSet: { id: optionSetId }
            }))
        }
        const successful = await saveOptionSet(sanitizedOptionSetData)
        if (successful) {
            onSave(sanitizedOptionSetData)
            onCloseClick()
        }
    }

    const valueTypes = SUPPORTED_VALUE_TYPES.map((type: string) => ({
        label: capitalize(type.replaceAll(/_/g, ' ')),
        value: type
    }))

    //Predefine the value type from the one selected on the field
    useEffect(() => {
        if (!form.formState.isDirty && valueType) {
            form.setValue('valueType', valueType)
        }
    }, [valueType])

    return (
        <Modal position="middle" hide={hide} onClose={onClose}>
            <ModalTitle>
                {i18n.t('Add option set')}
            </ModalTitle>
            <ModalContent>
                <FormProvider {...form}>
                    <form className="column gap-16">
                        <RHFTextInputField required validations={{ required: i18n.t('Name is required') }} name={`name`}
                                           label={i18n.t('Name')}/>
                        <RHFTextInputField disabled={!!defaultValue} required
                                           validations={{ required: i18n.t('Code is required') }} name={`code`}
                                           label={i18n.t('Code')}/>
                        <RHFSingleSelectField disabled={!!valueType} required
                                              validations={{ required: i18n.t('Type is required') }}
                                              options={valueTypes}
                                              name={'valueType'} label={i18n.t('Type')}/>
                        <OptionsList valueType={valueType}/>
                    </form>
                </FormProvider>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onCloseClick}>{i18n.t('Cancel')}</Button>
                    <Button loading={saving} onClick={form.handleSubmit(onSubmit)}
                            primary>{saving ? i18n.t('Saving') : i18n.t('Save')}</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
