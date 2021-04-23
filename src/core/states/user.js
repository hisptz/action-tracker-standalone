import {selector, atom} from "recoil";
import _ from 'lodash';
import {USER_ROLES} from "../constants";
import {PageState} from "./page";
import {useDataStore} from "@dhis2/app-service-datastore";
import DataStoreConstants from "../constants/datastore";
import {DimensionsState} from "./index";

export const UserState = atom({
    key: 'user',
    default: {}
});

const rolesMapper = USER_ROLES;

function disablePlanning(userRoles) {
    const planningEntities = _.filter(_.keys(rolesMapper), key => key !== 'actionStatus');
    const authorities = ['create', 'delete', 'update'];
    planningEntities.forEach(entity => {
        authorities.forEach(authority => {
            userRoles = _.set(userRoles, [entity, authority], false);
        })
    });
    return userRoles;
}

export const UserRolesState = selector({
    key: 'userRoles',
    get: ({get}) => {
        const {authorities} = get(UserState) || {};
        const activePage = get(PageState);
        const {orgUnit} = get(DimensionsState);
        console.log(orgUnit);
        const {globalSettings} = useDataStore();
        const settings = globalSettings.settings;
        const planningOrgUnitLevel = settings[DataStoreConstants.PLANNING_ORG_UNIT_KEY];

        let userRoles = {};
        _.map(_.keys(rolesMapper), (entity) => {
            _.map(_.keys(rolesMapper[entity]), (authority) => {
                if (_.find(authorities, (auth) => auth === 'ALL')) {
                    _.set(userRoles, `${entity}.${authority}`, true)
                } else {
                    if (_.find(authorities, (auth) => auth === rolesMapper[entity][authority])) {
                        _.set(userRoles, `${entity}.${authority}`, true)
                    } else {
                        _.set(userRoles, `${entity}.${authority}`, false)
                    }
                }
            });
        })
        if (activePage === 'Tracking' ) {
            return disablePlanning(userRoles);
        } else {
            return userRoles;
        }
    }
});

export const UserConfigState = selector({
    key: 'userConfig',
    get: ({get}) => {
        const {userCredentials} = get(UserState) || {};
        const ouMode = _.find(USER_ROLES, ['id', _.head(userCredentials?.userRoles)?.id])?.ouMode;
        return {ouMode}
    }
})

