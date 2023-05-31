import React from "react"
import {useParams} from "react-router-dom";
import {DATASTORE_NAMESPACE} from "../../shared/constants/meta";
import {useDataQuery} from "@dhis2/app-runtime";
import {Config} from "../../shared/schemas/config";
import {FullPageLoader} from "../../shared/components/Loaders";

const query = {
    config: {
        resource: `dataStore/${DATASTORE_NAMESPACE}`,
        id: ({id}: any) => id,
    }
}

export function Main() {
    const {id} = useParams();
    const {data, loading} = useDataQuery<{ config: Config }>(query, {
        variables: {
            id
        }
    });


    if (loading) {
        return <FullPageLoader/>
    }

    return (
        <div className="column w-100 h-100 center align-center">
            <h1>Main</h1>
        </div>
    )
}
