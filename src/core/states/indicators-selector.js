const {atom} = require("recoil");


const IndicatorPaginationState = atom({
    key: 'indicatorsPaginationKey',
    default: 1
})

const IndicatorSearchState = atom({
    key: 'indicatorSearchKeyword',
    default: undefined
})

export {
    IndicatorPaginationState,
    IndicatorSearchState
}
