import React, {useMemo} from 'react'
import {RHFSingleSelectField} from "@hisptz/dhis2-ui";
import {useOptionSets} from "./hooks/data";
import {Button, IconAdd24} from "@dhis2/ui"
import i18n from '@dhis2/d2-i18n';
import {useBoolean} from "usehooks-ts";
import {OptionSetData, OptionSetForm} from "./components/OptionSetForm";
import {useFormContext, useWatch} from "react-hook-form";
import {OPTION_SET_SUPPORTED_FIELDS} from "../../../../../../../../../../../shared/constants/meta";

export interface OptionSetFieldProps {
    label: string;
    name: string;
}

export function OptionSetField({...respProps}: OptionSetFieldProps) {
    const {setValue} = useFormContext()
    const valueType = useWatch({
        name: "type"
    })
    const {value: hideOptionSetForm, setTrue: onHideOptionSetForm, setFalse: onShowOptionSetForm} = useBoolean(true)

    const {optionSets, refetch} = useOptionSets(valueType);

    const options = useMemo(() => {
        return optionSets?.map(optionSet => ({
            label: optionSet.name,
            value: optionSet.id
        })) ?? []
    }, [optionSets]);

    const onOptionSetSave = (data: OptionSetData) => {
        //Auto assign the newly created option set to the field, refetch the options
        refetch();
        setValue(respProps.name, data.id)

    }

    if (!OPTION_SET_SUPPORTED_FIELDS.includes(valueType)) {
        setValue(respProps.name, undefined)
        return null;
    }

    return (
        <>
            <OptionSetForm
                valueType={valueType}
                onSave={onOptionSetSave}
                hide={hideOptionSetForm}
                onClose={onHideOptionSetForm}
            />
            <div className="row gap-16 space-between w-100 align-end">
                <div className="flex-1">
                    <RHFSingleSelectField {...respProps} options={options}/>
                </div>
                <Button onClick={onShowOptionSetForm} icon={<IconAdd24/>}>
                    {i18n.t("Add new")}
                </Button>
            </div>
        </>
    )
}
