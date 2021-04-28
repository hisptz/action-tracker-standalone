import {useDataEngine, useDataQuery} from "@dhis2/app-runtime";
import {useSetRecoilState} from "recoil";
import PlanningOrgUnitLevelState from "../states/orgUnit";
import {useEffect} from "react";
import {useDataStore} from "@dhis2/app-service-datastore";
import DataStoreConstants from "../constants/datastore";

const orgUnitQuery = {
    ou: {
        resource: 'organisationUnits',
        id: ({id}) => id,
        params: {
            fields: [
                'id',
                'name',
                'displayName',
                'level'
            ]
        }
    }
}

const orgUnitLevelQuery = {
    level: {
        resource: 'organisationUnitLevels',
        id: ({id}) => id,
        params: {
            fields: [
                'id',
                'name',
                'displayName',
                'level'
            ]
        }
    }
}

export default function useOrganisationUnit(id = '') {
    const {loading, data, error} = useDataQuery(orgUnitQuery, {variables: {id}});
    return {loading, error, orgUnit: data?.ou}
}

export function useOrganisationUnitLevel() {
    const {globalSettings} = useDataStore();
    const planningOrgUnitLevelId = globalSettings?.settings[DataStoreConstants.PLANNING_ORG_UNIT_KEY];
    const {loading, data, error} = useDataQuery(orgUnitLevelQuery, {variables: {id: planningOrgUnitLevelId}});
    const setPlanningOrgUnitLevel = useSetRecoilState(PlanningOrgUnitLevelState);
    useEffect(() => {
        function assign() {
            if (data) {
                setPlanningOrgUnitLevel(data?.level);
            }else{

            }
        }
        assign();
    }, [data]);
    return {loading, error}
}
