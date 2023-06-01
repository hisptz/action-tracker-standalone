import React, {useEffect} from "react"
import {useParams} from "react-router-dom";
import {DATASTORE_NAMESPACE} from "../../shared/constants/meta";
import {useDataMutation, useDataQuery} from "@dhis2/app-runtime";
import {Config} from "../../shared/schemas/config";
import {FullPageLoader} from "../../shared/components/Loaders";
import {initialMetadata} from "../../shared/constants/defaults";
import {generateMetadataFromConfig} from "../../shared/utils/metadata";
import {metadataMutation} from "../Welcome";

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

    const [sendMetadata, {loading: uploadingMetadata}] = useDataMutation(metadataMutation, {
        onError: (error) => {
            // logger.error(`${error.message}`, {
            //     error: error,
            // })
        }
    });


    useEffect(() => {
        if (data?.config) {
            const metadata = {
                ...initialMetadata,
                ...generateMetadataFromConfig(data?.config, {meta: initialMetadata})
            }
            sendMetadata({metadata})
        }
    }, [data?.config])


    if (loading) {
        return <FullPageLoader/>
    }

    return (
        <div className="column w-100 h-100 center align-center">
            <h1>Main</h1>
        </div>
    )
}
