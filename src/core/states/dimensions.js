const {atom} = require("recoil");


const DimensionsState = atom({
    key: 'selectedDimensions',
    default:{
        period: undefined,
        orgUnit: undefined,
        activePage: 'Planning'
    }
})

export {
    DimensionsState
}
