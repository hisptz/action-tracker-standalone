import {atom, selector, selectorFamily} from "recoil";
import {ActionStatusConstants} from "../constants";
import {find, get as _get, head} from "lodash";

const ConfigState = atom({
    key: 'config',
    default: {
        bottleneckProgramMetadata: {},
        actionProgramMetadata: {},
    }
});

const EngineState = atom({
    key: 'engine-state',
    default: undefined
})


const ActionStatusState = selector({
    key: 'actionStatus',
    get: ({get}) => {
        const {actionProgramMetadata} = get(ConfigState);
        const {dataElement} = find(head(actionProgramMetadata?.programStages)?.programStageDataElements, ['dataElement.id', ActionStatusConstants.STATUS_DATA_ELEMENT]) || {};
        return dataElement?.optionSet?.options || [];
    }
});


const PeriodConfigState = atom({
        key: 'periodConfig',
        default: {
            planning: undefined,
            tracking: undefined
        }
    }
)

const GlobalSettingsState = atom({
    key: 'global-settings-state'
})

const GlobalSettingsSelector = selectorFamily({
    key: 'global-settings-selector',
    get: (key) => ({get}) => {
        const globalSettings = get(GlobalSettingsState)
        return _get(globalSettings, key)
    }
})

export {
    ConfigState,
    ActionStatusState,
    PeriodConfigState,
    GlobalSettingsState,
    GlobalSettingsSelector,
    EngineState
}
