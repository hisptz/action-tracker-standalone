import { createHashRouter, RouterProvider } from 'react-router-dom'
import { MainNavigator } from './components/MainNavigator'
import { ROUTES } from './constants/nav'
import { resolveRoute } from './utils/nav'
import React, { Suspense } from 'react'
import { FullPageLoader } from '../../shared/components/Loaders'
import ErrorPage from '../../shared/components/ErrorPage'

const router = createHashRouter([
    {
        path: '/',
        element: <MainNavigator/>,
        errorElement: <ErrorPage/>
    },
    ...ROUTES.map(resolveRoute)
])

export function Routing () {
    return (<Suspense fallback={<FullPageLoader/>}>
            <RouterProvider fallbackElement={<FullPageLoader/>} router={router}/>
        </Suspense>
    )
}
