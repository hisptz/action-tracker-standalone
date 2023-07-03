import React from "react";
import i18n from '@dhis2/d2-i18n';
import {Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle} from "@dhis2/ui"
import {FormProvider, useForm} from "react-hook-form";
import {useFormMeta} from "./hooks/metadata";
import {isEmpty} from "lodash";
import {RHFDHIS2FormField} from "@hisptz/dhis2-ui";
import {ActionTrackingColumnStateConfig} from "../../../../../../state/columns";
import {useManageActionStatus} from "./hooks/data";

export interface ActionStatusFormProps {
    columnConfig: ActionTrackingColumnStateConfig
    onClose: () => void;
    hide: boolean;
    instance: any
}

export function ActionStatusForm({onClose, hide, instance, columnConfig}: ActionStatusFormProps) {
    const form = useForm();
    const {fields} = useFormMeta({columnConfig});
    const {saving, onSave} = useManageActionStatus({
        instance,
        onComplete: () => {

        }
    });

    return (
        <Modal position="middle" onClose={onClose} hide={hide}>
            <ModalTitle>
                {i18n.t("{{action}} status", {action: i18n.t("Add")})}
            </ModalTitle>
            <ModalContent>
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
                    <Button onClick={onClose}>
                        {i18n.t("Cancel")}
                    </Button>
                    <Button loading={saving} primary onClick={form.handleSubmit(onSave)}>
                        {saving ? i18n.t("Saving") : i18n.t("Save")}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )

}
