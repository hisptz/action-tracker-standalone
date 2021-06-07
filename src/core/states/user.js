import {selector, atom} from "recoil";
import * as _ from "lodash";
import {USER_ROLES} from "../constants";
import {PageState} from "./page";
import {DimensionsState} from "./index";
import PlanningOrgUnitLevelState from "./orgUnit";

export const UserState = atom({
    key: 'user',
    default: {}
});

const rolesMapper = USER_ROLES;
const authorities = ['create', 'delete', 'update'];

function disablePlanning(userRoles) {
    const planningEntities = _.filter(_.keys(rolesMapper), key => key !== 'actionStatus');

    planningEntities.forEach(entity => {
        authorities.forEach(authority => {
            userRoles = _.set(userRoles, [entity, authority], false);
        })
    });
    return userRoles;
}

function disableTracking(userRoles) {
    authorities.forEach(authority => {
        userRoles = _.set(userRoles, ['actionStatus', authority], false);
    })
    return userRoles;
}

function isPlanningOrgUnitLevel(orgUnit, planningOrgUnit) {
    if (_.isEmpty(orgUnit) || _.isEmpty(planningOrgUnit)) {
        return true;
    } else {
        const {level} = planningOrgUnit || {};
        const {path} = orgUnit || {};
        const orgUnitLevel = (path?.split('/'))?.length - 1;
        return level === orgUnitLevel
    }
}

export const UserRolesState = selector({
    key: 'userRoles',
    get: ({get}) => {
        const {authorities} = get(UserState) || {};
        const activePage = get(PageState);
        const {orgUnit} = get(DimensionsState);
        const planningOrgUnitLevel = get(PlanningOrgUnitLevelState);
        const planningLevelSelected = isPlanningOrgUnitLevel(orgUnit, planningOrgUnitLevel);
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
        });

        if (!planningLevelSelected) {
            return disableTracking(disablePlanning(userRoles));
        } else {
            if (activePage === 'Tracking') {
                return disablePlanning(userRoles);
            } else {
                return userRoles;
            }
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

