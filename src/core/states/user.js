import {selector, atom} from "recoil";
import _ from 'lodash';
import {USER_ROLES} from "../constants";

export const UserState = atom({
    key: 'user',
    default: {}
});


const rolesMapper = {
    bottleneck: {
        create: 'SAT_CREATE_BOTTLENECKS',
        update: 'SAT_UPDATE_BOTTLENECKS',
        delete: 'SAT_DELETE_BOTTLENECKS'
    },
    gap: {
        create: 'SAT_CREATE_GAPS',
        update: 'SAT_UPDATE_GAPS',
        delete: 'SAT_DELETE_GAPS'
    },
    possibleSolution: {
        create: 'SAT_CREATE_POSSIBLE_SOLUTIONS',
        update: 'SAT_UPDATE_POSSIBLE_SOLUTIONS',
        delete: 'SAT_DELETE_POSSIBLE_SOLUTIONS'
    },
    action: {
        create: 'SAT_CREATE_ACTIONS',
        update: 'SAT_UPDATE_ACTIONS',
        delete: 'SAT_DELETE_ACTIONS'
    },
    actionStatus: {
        create: 'SAT_CREATE_ACTION_STATUS',
        update: 'SAT_UPDATE_ACTION_STATUS',
        delete: 'SAT_DELETE_ACTION_STATUS'
    },

}


export const UserRolesState = selector({
    key: 'userRoles',
    get: ({get}) => {
        const {authorities} = get(UserState) || {};
        let userRoles = {};
        _.map(_.keys(rolesMapper), (key) => {
            _.map(_.keys(rolesMapper[key]), (authority) => {
                if (_.find(authorities, authority)) {
                    _.set(userRoles, `${key}.${authority}`, true)
                } else {
                    _.set(userRoles, `${key}.${authority}`, false)
                }
            });
        })
        return userRoles;
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
