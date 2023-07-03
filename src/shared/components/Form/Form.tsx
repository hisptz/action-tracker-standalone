import React, {useCallback} from "react";
import {Button, ButtonStrip, CircularLoader, Modal, ModalActions, ModalContent, ModalTitle} from "@dhis2/ui";
import i18n from '@dhis2/d2-i18n';
import {useFormMeta} from "./hooks/metadata";
import {FormProvider, useForm} from "react-hook-form";
import {isEmpty} from "lodash";
import {RHFDHIS2FormField} from "@hisptz/dhis2-ui";
import {Event, TrackedEntityInstance} from "@hisptz/dhis2-utils";
import {useFormActions} from "./hooks/save";
import {ParentConfig} from "../../schemas/config";

export interface FormProps {
    instanceName: string;
    id: string;
    type: 'program' | 'programStage',
    parentConfig?: ParentConfig,
    parent?: {
        id: string,
        instance: any;
    }
    hide: boolean;
    onClose: () => void;
    onSaveComplete?: () => void;
    defaultValue?: TrackedEntityInstance | Event;
}


function getDefaultValues(defaultValue: any, type: "program" | "programStage") {
    if (!defaultValue) return;

    if (type === "program") {
        return defaultValue?.attributes.reduce((acc: any, curr: any) => {
            acc[curr.attribute] = curr.value;
            return acc;
        }, {})
    } else {
        return defaultValue?.dataValues.reduce((acc: any, curr: any) => {
            acc[curr.dataElement] = curr.value;
            return acc;
        }, {});
    }
}


export function Form({
                         id,
                         type,
                         parent,
                         parentConfig,
                         instanceName,
                         hide,
                         onClose,
                         defaultValue,
                         onSaveComplete
                     }: FormProps) {
    const {fields, loading} = useFormMeta({id, type});
    const defaultValues = getDefaultValues(defaultValue, type);
    const form = useForm({
        defaultValues
    });

    const onComplete = useCallback(() => {
        form.reset({});
        if (onSaveComplete) {
            onSaveComplete();
        }
        onClose();
    }, [])
    const {onSave, saving} = useFormActions({
        defaultValue,
        instanceMetaId: id,
        type,
        parent,
        parentConfig,
        onComplete,
        instanceName
    });

    return (
        <Modal position="middle" hide={hide} onClose={onClose}>
            <ModalTitle>
                {defaultValue ? i18n.t("Update") : i18n.t("Add")} {instanceName}
            </ModalTitle>
            <ModalContent>
                {
                    loading && (<div><CircularLoader small/></div>)
                }
                {
                    !isEmpty(fields) && (
                        <FormProvider {...form} >
                            <div className="column gap-16">
                                {
                                    fields.map((field) => <RHFDHIS2FormField key={`${field.name}-field`} {...field} />)
                                }
                            </div>
                        </FormProvider>
                    )
                }
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onClose}>{i18n.t("Cancel")}</Button>
                    <Button loading={saving} onClick={form.handleSubmit(onSave)}
                            primary>{defaultValue ? saving ? i18n.t("Updating...") : i18n.t("Update") : saving ? i18n.t("Creating...") : i18n.t("Save")}</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}