import {useDataQuery} from "@dhis2/app-runtime";

const dataElementQuery = {
    dE: {
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
    at: {
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

export function useDataItems(type: "dataElement" | "attribute") {
    const {} = useDataQuery(type === "dataElement" ? dataElementQuery : attributesQuery)
}
