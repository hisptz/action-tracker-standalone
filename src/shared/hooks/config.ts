import {useParams} from "react-router-dom";
import {useDataQuery} from "@dhis2/app-runtime";
import {DATASTORE_NAMESPACE} from "../constants/meta";
import {Config} from "../schemas/config";


const query: any = {
    config: {
        resource: `dataStore/${DATASTORE_NAMESPACE}`,
        id: ({id}: { id: string }) => id,
    }
}

export function useConfiguration() {
    const {id} = useParams<{ id: string }>();
    const {data, loading} = useDataQuery<{ config: Config }>(query, {
        variables: {
            id
        }
    })
    return {
        config: data?.config,
        loading
    }
}
