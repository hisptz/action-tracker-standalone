import {atom, selector} from 'recoil'
import {UserState} from "./user";
import {Period} from "@iapps/period-utilities";

const DimensionsState = atom({
    key: 'selectedDimensions',
    default: selector({
        key: 'dimensions-selector',
        get: async ({get}) => {
            const user = get(UserState)
            const orgUnit = user?.organisationUnits[0];
            const period = new Period().setPreferences({allowFuturePeriods: true}).getById(new Date().getFullYear().toString());
            return {
                orgUnit,
                period,
                activeTab: 'planning'
            }
        },
    })
})

export {
    DimensionsState
}
