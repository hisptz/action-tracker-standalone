import { Outlet, type RouteObject } from 'react-router-dom'
import { type NavItem } from '../constants/nav'
import React from 'react'
import ErrorPage from '../../../shared/components/ErrorPage'

export function resolveRoute ({
                                  element,
                                  path,
                                  subItems,
                                  label
                              }: NavItem): RouteObject {
    const Element = element ?? Outlet
    return {
        path,
        element: <Element/>,
        errorElement: <ErrorPage/>,
        children: subItems?.map(resolveRoute),
        handle: {
            crumb: label
        },
        hasErrorBoundary: true
    }
}
