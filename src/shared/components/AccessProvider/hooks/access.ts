import { useRecoilValue } from 'recoil'
import { UserState } from '../../../state/user'
import { AccessType } from '../AccessProvider'

export function useAccess (access: AccessType) {
    const user = useRecoilValue(UserState)
    const authorities = user.authorities
    if (authorities.includes('ALL')) {
        return true
    }
    return authorities.includes(access)

}
