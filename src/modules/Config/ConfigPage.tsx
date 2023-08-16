import React, { useEffect } from 'react'
import { SideMenu } from './components/SideMenu'
import { Outlet } from 'react-router-dom'
import { useConfiguration } from '../../shared/hooks/config'
import { FormProvider, useForm } from 'react-hook-form'
import { Config } from '../../shared/schemas/config'
import { SaveArea } from './components/SaveArea'

function ConfigForm () {
    const { config } = useConfiguration()
    const form = useForm<Config>({
        shouldFocusError: false
    })

    useEffect(() => {
        form.reset(config ?? {})
    }, [config])

    return (
        <div className="column gap-16 h-100">
            <FormProvider {...form} >
                <div className="flex-1">
                    <Outlet/>
                </div>
                <div style={{ paddingBottom: 32 }}>
                    <SaveArea/>
                </div>
            </FormProvider>
        </div>
    )
}

export function ConfigPage () {

    return (
        <main className="w-100 row">
            <SideMenu/>
            <div className="w-100 p-32"
                 style={{
                     flexGrow: 1,
                     height: 'calc(100vh - 48px)',
                     overflowY: 'auto',
                     scrollbarGutter: 'stable'
                 }}>
                <ConfigForm/>
            </div>
        </main>
    )
}
