import {useDataQuery} from "@dhis2/app-runtime";

const orgUnitQuery = {
    ou: {
        resource: 'organisationUnits',
        id: ({id}) => id
    }
}

export default function useOrganisationUnit(id = '') {
    const {loading, data, error} = useDataQuery(orgUnitQuery, {variables: {id}});
    return {loading, error, orgUnit: data?.ou}
}
