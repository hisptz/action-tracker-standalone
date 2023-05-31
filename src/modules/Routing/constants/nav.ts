import type React from "react"
import {Welcome} from "../../Welcome"
import {Main} from "../../Main"
import {Config} from "../../Config"

export interface NavItem {
    label?: string | ((data: any) => any)
    id: string
    path: string
    element?: React.JSXElementConstructor<any>
    subItems?: NavItem[]
}

export const ROUTES: NavItem[] = [
    {
        path: "welcome",
        element: Welcome,
        id: "welcome"
    },
    {
        path: ":id",
        id: "main",
        subItems: [
            {
                path: "",
                element: Main,
                id: "main"
            },
            {
                path: "planning",
                element: Main,
                id: "main-planning"
            },
            {
                path: "tracking",
                element: Main,
                id: "main-tracking"
            }
        ]
    },
    {
        path: "config",
        id: "config",
        subItems: [
            {
                path: "",
                element: Config,
                id: "config"
            },
            {
                path: ":id",
                element: Config,
                id: "config-edit",
                subItems: [
                    {
                        path: "categorization",
                        element: Config,
                        id: "config-edit-categorization"
                    },
                    {
                        path: "action",
                        element: Config,
                        id: "config-edit-action"
                    },
                    {
                        path: "general",
                        element: Config,
                        id: "config-edit-general"
                    }
                ]
            },
            {
                path: "categorization",
                element: Config,
                id: "config-categorization"
            },
            {
                path: "action",
                element: Config,
                id: "config-action"
            },
            {
                path: "general",
                element: Config,
                id: "config-general"
            }
        ]
    }

]
