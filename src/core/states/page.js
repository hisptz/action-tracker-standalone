const {atom} = require("recoil");


const PageState = atom({
    key: 'page',
    default: 'Planning'
})

export {
    PageState
}
