import type React from "react"
import {Welcome} from "../../Welcome"
import {Main} from "../../Main"
import {Config} from "../../Config"
import i18n from '@dhis2/d2-i18n';
import {General} from "../../Config/components/General";
import {Categories} from "../../Config/components/Categories/Categories";
import {Actions} from "../../Config/components/Actions/Actions";

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
        element: Config,
        subItems: [
            {
                path: "general",
                label: i18n.t("General"),
                element: General,
                id: "config-edit-general"
            },
            {
                path: "categorization",
                label: i18n.t("Categories"),
                element: Categories,
                id: "config-edit-categorization"
            },
            {
                path: "action",
                label: i18n.t("Action"),
                element: Actions,
                id: "config-edit-action"
            }
        ]
    }

]
