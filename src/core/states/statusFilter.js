import {atom} from 'recoil'

const StatusFilterState = atom({
    key: 'statusFilter',
    default: {
        selected: ''
    }
});




export {
    StatusFilterState,
}

