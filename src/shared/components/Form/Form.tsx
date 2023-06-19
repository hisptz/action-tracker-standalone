import React from "react";
import {Button, ButtonStrip, CircularLoader, Modal, ModalActions, ModalContent, ModalHeader} from "@dhis2/ui";
import i18n from '@dhis2/d2-i18n';
import {useFormFields} from "./hooks/metadata";

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

    console.log(fields)

    return (
        <Modal hide={hide} onClose={onClose}>
            <ModalHeader>
                {title}
            </ModalHeader>
            <ModalContent>
                {
                    loading && (<div><CircularLoader small/></div>)
                }
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button>{i18n.t("Cancel")}</Button>
                    <Button primary>{i18n.t("Save")}</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
