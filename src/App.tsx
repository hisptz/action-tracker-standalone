import React from 'react'
import {Routing} from "./modules/Routing"
import "./common.css"
import "./main.css"
import {DataStoreProvider} from "@dhis2/app-service-datastore";
import config from "../d2.config.js"
import {FullPageLoader} from "./shared/components/Loaders";
import {DataStoreTransport, logger} from "./shared/utils/logging";
import {useDataEngine} from "@dhis2/app-runtime";
import winston from "winston";

export default function App(): React.JSX.Element {
    const engine = useDataEngine();
    logger.add(new DataStoreTransport({
        engine,
        format: winston.format.json()
    }))

    return (
        <DataStoreProvider
            namespace={config.dataStoreNamespace}
            loadingComponent={<FullPageLoader/>}
        >
            <Routing/>
        </DataStoreProvider>
    )
}
