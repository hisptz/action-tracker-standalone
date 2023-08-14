import { selector } from 'recoil'
import { DataEngineState } from './engine'
import { User } from '../types/dhis2'

export interface EnhancedUser extends User {
    authorities: string[]
}

const userQuery = {
    user: {
        resource: 'me',
        params: {
            fields: [
                'authorities',
                'id',
                'username',
                'fullName'
            ]
        }
    }
}

export const UserState = selector<EnhancedUser>({
    key: 'user-state',
    get: async ({ get }) => {
        const engine = get(DataEngineState)
        const response = await engine.query(userQuery)
        return response?.user as unknown as EnhancedUser
    }
})
