import React from 'react'
import { Navigate } from 'react-router-dom'
import { FullPageLoader } from '../../../shared/components/Loaders'
import { head, isEmpty } from 'lodash'
import { useConfigurations } from '../../../shared/hooks/config'

export function MainNavigator() {
    const { configs, loading} = useConfigurations()

    if (!loading) {
        if (!isEmpty(configs)) {
            return <Navigate to={`/${head(configs) as string}?type=planning`}/>
        } else {
           return <Navigate to={`/welcome`}/>
        }
    }

    return <FullPageLoader/>
}
