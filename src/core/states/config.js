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
    get: async ({get}) => {
        const engine = get(DataEngineState);
        const {actionProgramMetadata} = get(ConfigState);
        const {dataElement} = _.find(_.head(actionProgramMetadata?.programStages)?.programStageDataElements, ['dataElement.id', ActionStatusConstants.STATUS_DATA_ELEMENT]) || {};
        const options = dataElement?.optionSet?.options || []
        const optionsWithSvgIcons = [];
        for (const option of options) {
            const {style} = option;
            const iconName = style?.icon
            if (iconName) {
                try {
                    const {icon} = await engine.query(iconQuery, {variables: {id: `${iconName}/icon.svg`}});
                    const newOption = {...option, style: {...style, icon}}
                    optionsWithSvgIcons.push(newOption);
                } catch (e) {
                    console.log(e);
                }
            }
        }
        return optionsWithSvgIcons;
    }
});

const DataEngineState = atom({
    key: 'dataEngineState',
    default: undefined
});


export {
    ConfigState,
    ActionStatusState,
    DataEngineState
}
