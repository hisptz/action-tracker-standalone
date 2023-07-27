import { IconArrowLeft24, Menu, MenuItem } from '@dhis2/ui'
import React from 'react'
import { find } from 'lodash'
import classes from './SideMenu.module.css'
import { ROUTES } from '../../../Routing/constants/nav'
import { useMatches, useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import i18n from '@dhis2/d2-i18n'

export function SideMenu() {
    const configurationPages = find(ROUTES, ['id', 'config'])?.subItems?.filter(({path}) => path !== "");
    const matches = useMatches();
    const navigate = useNavigate()

    return (
        <aside style={{width: "30vw", maxWidth: 300, flexGrow: 0}}>
            <Menu className={classes['menu-area']}>
                <MenuItem className={classes['menu-item']} icon={<IconArrowLeft24/>} label={i18n.t("Back")} onClick={() => { navigate('/'); }}/>
                {
                    configurationPages?.map((item) => (
                        <MenuItem
                            onClick={() => { navigate(`${item.path}`); }}
                            className={classNames(classes['menu-item'], {
                                [classes.selected]: matches.some(match => match.pathname.match(item.path))
                            })} label={item.label} key={`${item.id}-menu-item`}/>))
                }
            </Menu>
        </aside>
    )
}
