import {useDataQuery} from "@dhis2/app-runtime";

const orgUnitQuery = {
    ou: {
        resource: 'organisationUnits',
        id: ({id}) => id,
        params: {
            fields: [
                'id',
                'name',
                'displayName'
            ]
        }
    }
}

const orgUnitLevelQuery = {
    level: {
        resource: 'organisationUnitLevels',
        id:({id})=>id,
        params: {
            fields: [
                'id',
                'name',
                'displayName'
            ]
        }
    }
}

export default function useOrganisationUnit(id = '') {
    const {loading, data, error} = useDataQuery(orgUnitQuery, {variables: {id}});
    console.log(data);
    return {loading, error, orgUnit: data?.ou}
}

export function useOrganisationUnitLevel(id=''){
    const {loading, data, error} = useDataQuery(orgUnitLevelQuery, {variables: {id}});
    return {loading, error, orgUnitLevel: data?.level}
}
