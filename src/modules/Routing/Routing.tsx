import {createHashRouter, RouterProvider} from "react-router-dom"
import {MainNavigator} from "./components/MainNavigator"
import {ROUTES} from "./constants/nav"
import {resolveRoute} from "./utils/nav"
import React, {Suspense} from "react"
import {FullPageLoader} from "../../shared/components/Loaders"

const router = createHashRouter([
    {
        path: "/",
        element: <MainNavigator/>
    },
    ...ROUTES.map(resolveRoute)
])

export function Routing() {
    return (<Suspense fallback={<FullPageLoader/>}>
            <RouterProvider router={router}/>
        </Suspense>
    )
}
