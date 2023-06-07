import React, {useEffect} from "react"
import {Navigate, useNavigate} from "react-router-dom"
import {useDataQuery} from "@dhis2/app-runtime";
import {FullPageLoader} from "../../../shared/components/Loaders";
import {head} from "lodash";
import {DATASTORE_NAMESPACE} from "../../../shared/constants/meta";

const keysToExclude = ["settings", "savedObjects", "logs"]

const configQuery: any = {
    config: {
        resource: `dataStore/${DATASTORE_NAMESPACE}`
    }
}

export function MainNavigator() {
    const navigate = useNavigate();
    const {data, loading} = useDataQuery<{ config: string[] }>(configQuery);

    useEffect(() => {
        if (data?.config) {
            const keys = data.config.filter(key => !keysToExclude.includes(key));

            if (keys.length > 0) {
                navigate(`/${head(keys)}?type=planning`)
            } else {
                navigate(`/welcome`)
            }
        }
    }, [data?.config])

    if (loading) {
        return <FullPageLoader/>
    }

    return (
        <Navigate to={`/welcome`}/>
    )
}
