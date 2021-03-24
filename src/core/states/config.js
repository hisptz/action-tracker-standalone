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
const ActionStatusState = selector({
    key: 'actionStatus',
    get: ({get}) => {
        const {actionProgramMetadata} = get(ConfigState);
        const {dataElement} = _.find(_.head(actionProgramMetadata?.programStages)?.programStageDataElements, ['dataElement.id', ActionStatusConstants.STATUS_DATA_ELEMENT]) || {};

        return dataElement?.optionSet?.options || []
    }
})

export {
    ConfigState,
    ActionStatusState
}
