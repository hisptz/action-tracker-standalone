import React, {useMemo} from "react";
import {Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle} from "@dhis2/ui";
import i18n from '@dhis2/d2-i18n';
import {FormProvider, useForm} from "react-hook-form";
import {useManageColumns} from "../../DataArea/components/DataCard/hooks/columns";
import {RHFCheckboxField} from "@hisptz/dhis2-ui";

export interface ManageColumnsModalProps {
    onClose: () => void,
    hide: boolean,
}

export function ManageColumnsModal({onClose, hide}: ManageColumnsModalProps) {
    const {columns, manageColumns} = useManageColumns();
    const defaultValues = useMemo(() => columns.reduce((acc, column) => {
        acc[column.id] = column.visible;
        return acc;
    }, {} as { [key: string]: boolean }), [columns]);

    const form = useForm<{ [key: string]: boolean }>({
        defaultValues
    });
    const onCloseModal = () => {
        form.reset();
        onClose();
    }
    const onSubmit = (data: { [key: string]: boolean }) => {
        manageColumns(columns.map(column => {
            return {
                ...column,
                visible: data[column.id]
            }
        }));
        onCloseModal()
    }

    return (
        <Modal position="middle" hide={hide} onClose={onCloseModal}>
            <ModalTitle>{i18n.t("Manage columns")}</ModalTitle>
            <ModalContent>
                <FormProvider {...form}>
                    <form className="column gap-16">
                        {
                            columns.map((column) => (
                                <RHFCheckboxField key={`${column.id}-visible-checkbox`} label={column.name}
                                                  name={column.id}/>
                            ))
                        }
                    </form>
                </FormProvider>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onCloseModal}>{i18n.t("Cancel")}</Button>
                    <Button onClick={form.handleSubmit(onSubmit)} primary>{i18n.t("Update")}</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
