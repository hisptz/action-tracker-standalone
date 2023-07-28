import { useParams } from "react-router-dom";
import { useDataQuery } from "@dhis2/app-runtime";
import { DATASTORE_NAMESPACE } from "../constants/meta";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { ConfigState } from "../state/config";

export function useConfiguration () {
    const { id } = useParams<{ id: string }>();
    const config = useRecoilValue(ConfigState(id));

    return {
        config,
        id
    };
}

const configQuery: never = {
    config: {
        resource: `dataStore/${DATASTORE_NAMESPACE}`
    }
};
const keysToExclude = ["settings", "savedObjects", "logs"];

export function useConfigurations () {
    const {
        data,
        loading,
        refetch
    } = useDataQuery<{ config: string[] }>(configQuery);
    const configs = useMemo(() => data?.config.filter(key => !keysToExclude.includes(key)), [data?.config]);

    return {
        configs,
        loading,
        refetch
    };
}
