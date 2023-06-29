import React, {useCallback} from "react";
import {Button, ButtonStrip, CircularLoader, Modal, ModalActions, ModalContent, ModalTitle} from "@dhis2/ui";
import i18n from '@dhis2/d2-i18n';
import {useFormMeta} from "./hooks/metadata";
import {FormProvider, useForm} from "react-hook-form";
import {isEmpty} from "lodash";
import {RHFDHIS2FormField} from "@hisptz/dhis2-ui";
import {TrackedEntityInstance} from "@hisptz/dhis2-utils";
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
    defaultValues?: TrackedEntityInstance | Event;
}


export function Form({
                         id,
                         type,
                         parent,
                         parentConfig,
                         instanceName,
                         hide,
                         onClose,
                         defaultValues,
                         onSaveComplete
                     }: FormProps) {
    const {fields, loading} = useFormMeta({id, type});
    const form = useForm();

    const onComplete = useCallback(() => {
        form.reset({});
        if (onSaveComplete) {
            onSaveComplete();
        }
        onClose();
    }, [])
    const {create, creating, updating, update} = useFormActions({
        instanceMetaId: id,
        type,
        parent,
        parentConfig,
        onComplete,
        instanceName
    });

    const onSubmit = useCallback(async (data: Record<string, any>) => {
        if (defaultValues) {
            await update(data);
        } else {
            await create(data);
        }
    }, [create])

    return (
        <Modal position="middle" hide={hide} onClose={onClose}>
            <ModalTitle>
                {defaultValues ? i18n.t("Update") : i18n.t("Add")} {instanceName}
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
                    <Button loading={creating || updating} onClick={form.handleSubmit(onSubmit)}
                            primary>{defaultValues ? updating ? i18n.t("Updating...") : i18n.t("Update") : creating ? i18n.t("Creating...") : i18n.t("Save")}</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
