import {useDataQuery} from "@dhis2/app-runtime";

const indicatorQuery = {
    data: {
        resource: 'indicators',
        params: ({page}) => ({
            page,
            totalCount: true
        })
    }
}

export default function useIndicators(page = 0) {
    const {loading, data, error} = useDataQuery(indicatorQuery, {variables: {page}});
    const {totalPages, total, pageSize, indicators} = data?.data || {};
    return {loading, error, total, totalPages, pageSize, indicators}
}


const indicatorNameQuery = {
    data: {
        resource: 'indicators',
        id: ({id}) => id,
    }
}

export function useIndicatorsName(indicatorId = '') {
    const {loading, data, error} = useDataQuery(indicatorNameQuery, {variables: {id: indicatorId}});
    return {loading, error, name: data?.data.displayName}
}
