const {atom} = require("recoil");


const IndicatorPaginationState = atom({
    key: 'indicatorsPaginationKey',
    default: 0
})

export {
    IndicatorPaginationState
}
