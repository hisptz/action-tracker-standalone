import React from "react";
import {Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle} from "@dhis2/ui";
import i18n from '@dhis2/d2-i18n';
import {DataField} from "../../schemas/config";
import {FormProvider, useForm} from "react-hook-form";
import {useDataItems} from "./hooks/data";
import {RHFCheckboxField, RHFSingleSelectField} from "@hisptz/dhis2-ui";
import {find} from "lodash";
import {useAlert} from "@dhis2/app-runtime";

export interface DataItemSelectProps {
    type: "dataElement" | "attribute",
    hide: boolean;
    onClose: () => void;
    onAdd: (data: DataField) => void;
    filtered: string[]
}

export function DataItemSelect({type, hide, onAdd, onClose, filtered}: DataItemSelectProps) {
    const {show, hide: hideAlert} = useAlert(({message}) => message, ({type}) => ({...type, duration: 3000}))
    const {options, values, loading, error} = useDataItems(type, {filtered});
    const form = useForm<DataField>({});

    const onCloseClick = () => {
        form.reset();
        onClose();
    }
    const onSubmit = async (data: DataField) => {
        const selectedValue = find(values, ['id', data.id]);
        if (!selectedValue) {
            show({
                message: `${i18n.t("Could not add the new data item. Please refresh the page and try again")}`,
                type: {critical: true}
            });
            await new Promise((resolve) => setTimeout(resolve, 5000));
            hideAlert();
            return;
        }
        const sanitizedData: DataField = {
            ...data,
            type: selectedValue.valueType as any,
            name: selectedValue.formName ?? selectedValue.shortName,
        }
        onAdd(sanitizedData);
        onCloseClick();
    }


    return (
        <Modal position="middle" hide={hide} onClose={onClose}>
            <ModalTitle>
                {i18n.t("Select Data Item")}
            </ModalTitle>
            <ModalContent>
                <FormProvider {...form} >
                    <form className="column gap-16">
                        <RHFSingleSelectField
                            required
                            validations={{required: i18n.t("Data item is required")}}
                            loading={loading} label={i18n.t("Data item")} options={options}
                            name={`id`}/>
                        <RHFCheckboxField name={`mandatory`} label={i18n.t("Field should be mandatory")}/>
                        {
                            type === "attribute" ? (
                                <RHFCheckboxField name={`header`} label={i18n.t("Show field as header")}/>
                            ) : (
                                <RHFCheckboxField name={`showAsColumn`} label={i18n.t("Show field as column")}/>
                            )
                        }
                    </form>
                </FormProvider>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onCloseClick}>{i18n.t("Cancel")}</Button>
                    <Button onClick={form.handleSubmit(onSubmit)} primary>{i18n.t("Add")}</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
