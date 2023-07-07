import {useFormContext} from "react-hook-form";
import {Config} from "../../../shared/schemas/config";
import {Button, ButtonStrip} from "@dhis2/ui";
import i18n from "@dhis2/d2-i18n";
import React from "react";
import {DATASTORE_NAMESPACE} from "../../../shared/constants/meta";
import {useAlert, useDataMutation} from "@dhis2/app-runtime";


const mutation = {
    resource: `dataStore/${DATASTORE_NAMESPACE}`,
    type: "update",
    id: ({data}: { data: Config }) => data?.id,
    data: ({data}: { data: Config }) => data,
}

export function SaveArea() {
    const {show, hide} = useAlert(({message}) => message, ({type}) => ({...type, duration: 3000}))
    const form = useFormContext<Config>();
    const [update, {loading}] = useDataMutation(mutation as any, {
        onError: async (error) => {
            show({message: `${i18n.t("Error saving changes")}: ${error.message}`, type: {critical: true}});
            await new Promise((resolve) => setTimeout(resolve, 5000));
            hide();
        }
    })
    const onSave = async (data: Config) => {
        await update({data});
        show({message: i18n.t("Changes saved successfully"), type: {success: true}})
    }
    return (
        <div style={{display: "flex", justifyContent: "flex-end"}} className="row gap-16">
            <ButtonStrip>
                <Button disabled={!form.formState.isDirty}>
                    {i18n.t("Reset")}
                </Button>
                <Button loading={loading} onClick={form.handleSubmit(onSave)} primary
                        disabled={!form.formState.isDirty}>
                    {loading ? i18n.t("Saving") : i18n.t("Save changes")}
                </Button>
            </ButtonStrip>
        </div>
    )
}
