import {atom, selector} from "recoil";
import _ from 'lodash';
import {ActionStatusConstants} from "../constants";

const ConfigState = atom({
    key: 'config',
    default: {
        bottleneckProgramMetadata: {},
        actionProgramMetadata: {},
    }
});

const iconQuery = {
    icon: {
        resource: 'icons',
        id: ({id}) => id
    }
}

const ActionStatusState = selector({
    key: 'actionStatus',
    get: ({get}) => {
        const {actionProgramMetadata} = get(ConfigState);
        const {dataElement} = _.find(_.head(actionProgramMetadata?.programStages)?.programStageDataElements, ['dataElement.id', ActionStatusConstants.STATUS_DATA_ELEMENT]) || {};
        return dataElement?.optionSet?.options || [];
    }
});

const DataEngineState = atom({
    key: 'dataEngineState',
    default: undefined
});

//TODO: Refactor to remove the usage of data engine state as it is redundant

const PeriodConfigState = atom({
        key: 'periodConfig',
        default: {
            planning: undefined,
            tracking: undefined
        }
    }
)

export {
    ConfigState,
    ActionStatusState,
    DataEngineState,
    PeriodConfigState
}
