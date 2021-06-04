import {useDataQuery} from "@dhis2/app-runtime";
import {useSetRecoilState} from "recoil";
import PlanningOrgUnitLevelState from "../states/orgUnit";
import {useEffect, useState} from "react";
import { useSetting} from "@dhis2/app-service-datastore";
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
    const [planningOrgUnitLevelId] = useSetting(DataStoreConstants.PLANNING_ORG_UNIT_KEY, {global: true})
    const {loading, data, error} = useDataQuery(orgUnitLevelQuery, {variables: {id: planningOrgUnitLevelId}});
    const setPlanningOrgUnitLevel = useSetRecoilState(PlanningOrgUnitLevelState);
    const [noConfig, setNoConfig] = useState(false);
    useEffect(() => {
        function assign() {
           if(planningOrgUnitLevelId){
               if (data) {
                   setPlanningOrgUnitLevel(data?.level);
               }
           }else{
               setNoConfig(true);
           }
        }
        assign();
    }, [data]);
    return {loading, error, noConfig}
}
