import React from "react";
import {SideMenu} from "./components/SideMenu";
import {Outlet} from "react-router-dom";
import {useConfiguration} from "../../shared/hooks/config";
import {FormProvider, useForm} from "react-hook-form";
import {Config} from "../../shared/schemas/config";
import {FullPageLoader} from "../../shared/components/Loaders";
import {SaveArea} from "./components/SaveArea";


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
            <div className="w-100 h-100 p-32" style={{flexGrow: 1}}>
                <ConfigForm/>
            </div>
        </main>
    )
}
