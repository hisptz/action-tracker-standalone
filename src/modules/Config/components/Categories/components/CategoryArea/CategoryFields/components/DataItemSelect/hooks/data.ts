import {useDataQuery} from "@dhis2/app-runtime";
import {useMemo} from "react";

const dataElementQuery = {
    items: {
        resource: "dataElements",
        params: () => ({
            fields: [
                'id',
                'shorName',
                'formName',
                'valueType'
            ],
            filter: [
                'domainType:eq:TRACKER'
            ]
        })
    }
}

const attributesQuery = {
    items: {
        resource: "trackedEntityAttributes",
        params: () => ({
            fields: [
                'id',
                'shorName',
                'formName',
                'valueType'
            ]
        })
    }
}

export function useDataItems(type: "dataElement" | "attribute", {filtered}: { filtered: string[] }) {
    const {data: dEData, loading: dELoading, error: dEError} = useDataQuery<{
        items: {
            dataElements: { id: string; shortName: string; formName: string; valueType: string; }[],
        }
    }>(dataElementQuery, {
        lazy: type !== "dataElement"
    });
    const {data: attrData, loading: attrLoading, error: attrError} = useDataQuery<{
        items: {
            trackedEntityAttributes: { id: string; shortName: string; formName: string; valueType: string; }[],
        }
    }>(attributesQuery, {
        lazy: type !== "attribute"
    });
    const values = useMemo(() => {
        if (type === "dataElement") {
            return dEData?.items?.dataElements?.filter(({id}) => !filtered.includes(id)) ?? []
        } else {
            return attrData?.items?.trackedEntityAttributes?.filter(({id}) => !filtered.includes(id)) ?? []
        }
    }, [attrData, dEData]);

    const options = useMemo(() => {
        return values?.map(({formName, id}) => ({label: formName, value: id}))
    }, [values]);
    return {
        values,
        options,
        loading: attrLoading || dELoading,
        error: attrError ?? dEError
    }
}
