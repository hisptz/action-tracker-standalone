import React from "react";
import {SideMenu} from "./components/SideMenu";
import {Outlet} from "react-router-dom";
import {useConfiguration} from "../../shared/hooks/config";
import {FormProvider, useForm, useFormContext} from "react-hook-form";
import {Config} from "../../shared/schemas/config";
import {FullPageLoader} from "../../shared/components/Loaders";
import {Button, ButtonStrip} from "@dhis2/ui"
import i18n from '@dhis2/d2-i18n';


export function SaveArea() {
    const form = useFormContext<Config>();

    const onSave = (data: Config) => {
        console.log(data)
    }

    return (
        <div style={{display: "flex", justifyContent: "flex-end"}} className="row gap-16">
            <ButtonStrip>
                <Button disabled={!form.formState.isDirty}>
                    {i18n.t("Reset")}
                </Button>
                <Button onClick={form.handleSubmit(onSave)} primary disabled={!form.formState.isDirty}>
                    {i18n.t("Save changes")}
                </Button>
            </ButtonStrip>
        </div>
    )
}

function ConfigForm() {
    const {config} = useConfiguration();
    const form = useForm<Config>({
        defaultValues: config,
        shouldFocusError: false
    })

    return (
        <div className="column gap-16">
            <FormProvider {...form} >
                <SaveArea/>
                <Outlet/>
                <SaveArea/>
            </FormProvider>
        </div>
    )
}

export function ConfigPage() {
    const {loading} = useConfiguration();

    if (loading) {
        return <FullPageLoader/>
    }

    return (
        <main className="w-100 h-100 row">
            <SideMenu/>
            <div className="w-100 h-100 p-16" style={{flexGrow: 1}}>
                <ConfigForm/>
            </div>
        </main>
    )
}
