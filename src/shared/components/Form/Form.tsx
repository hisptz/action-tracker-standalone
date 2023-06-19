import React, {useCallback} from "react";
import {Button, ButtonStrip, CircularLoader, Modal, ModalActions, ModalContent, ModalTitle} from "@dhis2/ui";
import i18n from '@dhis2/d2-i18n';
import {useFormFields} from "./hooks/metadata";
import {FormProvider, useForm} from "react-hook-form";
import {isEmpty} from "lodash";
import {RHFDHIS2FormField} from "@hisptz/dhis2-ui";

export interface FormProps {
    title: string;
    id: string;
    type: 'program' | 'programStage',
    parent?: {
        id: string;
        type: 'program' | 'programStage',
    },
    hide: boolean;
    onClose: () => void;
}


export function Form({id, type, parent, title, hide, onClose}: FormProps) {
    const {fields, loading} = useFormFields({id, type});
    const form = useForm();

    const onSubmit = useCallback((data: Record<string, any>) => {
        console.log(data)
    }, [])

    return (
        <Modal position="middle" hide={hide} onClose={onClose}>
            <ModalTitle>
                {title}
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
                                    fields.map((field) => <RHFDHIS2FormField key={field.id} {...field} />)
                                }
                            </div>
                        </FormProvider>
                    )
                }
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onClose}>{i18n.t("Cancel")}</Button>
                    <Button onClick={form.handleSubmit(onSubmit)} primary>{i18n.t("Save")}</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
