import React, { useMemo } from 'react'
import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui'
import { FormProvider, useForm } from 'react-hook-form'
import { useFormMeta } from './hooks/metadata'
import { isEmpty } from 'lodash'
import { RHFDHIS2FormField } from '@hisptz/dhis2-ui'
import { ActionTrackingColumnStateConfig } from '../../../../../../state/columns'
import { useManageActionStatus } from './hooks/save'
import { DateTime } from 'luxon'

export interface ActionStatusFormProps {
    columnConfig: ActionTrackingColumnStateConfig;
    defaultValue?: any;
    onClose: () => void;
    onComplete: () => void;
    hide: boolean;
    instance: any
}

export function ActionStatusForm({
                                     onClose,
                                     onComplete,
                                     hide,
                                     instance,
                                     columnConfig,
                                     defaultValue
                                 }: ActionStatusFormProps) {

    const defaultValues = useMemo(() => {
        if (!defaultValue) return {}
        const occurredAt = DateTime.fromJSDate(new Date(defaultValue.occurredAt)).toFormat('yyyy-MM-dd');
        const dataValues = defaultValue.dataValues.reduce((acc: Record<string, any>, dataValue: {
            dataElement: string;
            value: string
        }) => {
            acc[dataValue.dataElement] = dataValue.value;
            return acc;
        }, {})

        return {
            occurredAt,
            ...dataValues
        }
    }, [defaultValue])
    const form = useForm({
        defaultValues
    });
    const {fields} = useFormMeta({columnConfig});
    const {saving, onSave} = useManageActionStatus({
        instance,
        onComplete: () => {
            onComplete();
            onClose();
        },
        defaultValue,
        columnConfig
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
                        {!!defaultValue ? saving ? i18n.t("Updating") : i18n.t("Update") : saving ? i18n.t("Saving") : i18n.t("Save")}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )

}
