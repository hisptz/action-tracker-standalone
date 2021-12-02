import {selectorFamily} from "recoil";
import {EngineState} from "./config";
import {queue} from 'async'


const iconQuery = {
    icon: {
        resource: 'icons',
        id: ({id}) => id
    }
}

async function getIcon({engine, iconName}) {
    return await engine.query(iconQuery, {variables: {id: `${iconName}/icon.svg`}})
}

const q = queue(getIcon, 5)

const Dhis2IconState = selectorFamily({
    key: 'icon-state',
    get: (iconName) => async ({get}) => {
        const engine = get(EngineState)
        if (engine) {
            const data = await q.push({engine, iconName})
            if (data) {
                if (data.icon) {
                    if (data.icon instanceof Blob) {
                        return (await data.icon.text());
                    } else {
                        return (data.icon);
                    }
                }
            }
        }
    }
})

export {
    Dhis2IconState
}
