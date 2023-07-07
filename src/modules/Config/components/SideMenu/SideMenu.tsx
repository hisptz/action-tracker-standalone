import {Menu, MenuItem} from "@dhis2/ui";
import React from "react";
import {find} from "lodash";
import classes from "./SideMenu.module.css"
import {ROUTES} from "../../../Routing/constants/nav";
import {useMatches, useNavigate} from "react-router-dom";
import classNames from "classnames";

export function SideMenu() {
    const configurationPages = find(ROUTES, ['id', 'config'])?.subItems?.filter(({path}) => path !== "");
    const matches = useMatches();
    const navigate = useNavigate()

    return (
        <aside style={{width: "30vw", maxWidth: 300, flexGrow: 0}}>
            <Menu className={classes['menu-area']}>
                {
                    configurationPages?.map((item) => (
                        <MenuItem
                            onClick={() => navigate(`${item.path}`)}
                            className={classNames(classes['menu-item'], {
                                [classes['selected']]: matches.some(match => match.pathname.match(item.path))
                            })} label={item.label} key={`${item.id}-menu-item`}/>))
                }
            </Menu>
        </aside>
    )
}
