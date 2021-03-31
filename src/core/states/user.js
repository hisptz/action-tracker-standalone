import {selector, atom} from "recoil";
import _ from 'lodash';
import {USER_ROLES} from "../constants";

export const UserState = atom({
    key: 'user',
    default: {}
});

export const UserRolesState = selector({
    key: 'userRoles',
    get: ({get}) => {
        const {userCredentials} = get(UserState) || {};
        return _.find(USER_ROLES, ['id', _.head(userCredentials?.userRoles)?.id ])
    }
})
