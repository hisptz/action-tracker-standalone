import React from 'react'
import { Routing } from './modules/Routing'
import './common.css'
import './main.css'
import 'intro.js/introjs.css'
import './intro-js.css'
import { DataStoreProvider } from '@dhis2/app-service-datastore'
import { FullPageLoader } from './shared/components/Loaders'
import { DATASTORE_NAMESPACE } from './shared/constants/meta'
import { type MutableSnapshot, RecoilRoot } from 'recoil'
import { ConfirmDialogProvider } from '@hisptz/dhis2-ui'
import { useDataEngine } from '@dhis2/app-runtime'
import { DataEngineState } from './shared/state/engine'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './locales'

const reactQueryClient = new QueryClient()

export default function App (): React.JSX.Element {
    const engine = useDataEngine()

    function initEngine ({ set }: MutableSnapshot) {
        set(DataEngineState, engine)
    }

    return (
        <QueryClientProvider client={reactQueryClient}>
            <DataStoreProvider
                namespace={DATASTORE_NAMESPACE}
                loadingComponent={<FullPageLoader/>}
            >
                <RecoilRoot initializeState={initEngine}>
                    <ConfirmDialogProvider>
                        <Routing/>
                    </ConfirmDialogProvider>
                </RecoilRoot>
            </DataStoreProvider>
        </QueryClientProvider>
    )
}
