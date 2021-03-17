import {atom} from "recoil";


const ConfigState = atom({
    key: 'config',
    default:{
        bottleneckProgramMetadata: {},
        actionProgramMetadata: {},
    }
})

export {
    ConfigState
}
