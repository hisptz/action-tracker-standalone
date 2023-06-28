import React from 'react'
import {Routing} from "./modules/Routing"
import "./common.css"
import "./main.css"
import {DataStoreProvider} from "@dhis2/app-service-datastore";
import {FullPageLoader} from "./shared/components/Loaders";
import {DATASTORE_NAMESPACE} from "./shared/constants/meta";
import {RecoilRoot} from "recoil";

export default function App(): React.JSX.Element {

    return (
        <DataStoreProvider
            namespace={DATASTORE_NAMESPACE}
            loadingComponent={<FullPageLoader/>}
        >
            <RecoilRoot>
                <Routing/>
            </RecoilRoot>
        </DataStoreProvider>
    )
}
