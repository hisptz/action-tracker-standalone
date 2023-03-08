import {MenuItem} from '@dhis2/ui';
import React, {useMemo} from 'react';
import {MemoryRouter, Outlet, Routes, useNavigate} from "react-router-dom";
import BackIcon from '@material-ui/icons/ArrowBack';
import AdminMenu from "./Components/Menu";
import ActionStatusLegendSettingsPage from "./Components/ActionStatusLegend";
import ChallengeMethodsSettingsPage from "./Components/ChallengeMethods";
import GeneralSettingsPage from "./Components/GeneralSettings";
import i18n from '@dhis2/d2-i18n'
import classes from './admin.module.css'
import {useResetRecoilState} from "recoil";
import {DimensionsState} from "../../core/states";


export default function AdminPage() {
    const resetConfig = useResetRecoilState(DimensionsState)
    const menu = useMemo(() => [
        {
            pathname: 'general-settings',
            component: GeneralSettingsPage,
            label: i18n.t('General Settings')
        },
        {
            pathname: 'challenge-methods',
            component: ChallengeMethodsSettingsPage,
            label: i18n.t('Challenge Identification Methods')
        },
        {
            pathname: 'action-status-settings',
            component: ActionStatusLegendSettingsPage,
            label: i18n.t('Action Status Settings')
        },
    ], []);

    const navigate = useNavigate();

    return (
        <div className={classes['admin-container']}>
                <div className={classes['side-menu']}>
                    <div className={classes['side-menu-container']}>
                        <div className={classes['back-menu-item']}>
                            <MenuItem onClick={_ => {
                                resetConfig();
                                navigate(-1)
                            }} label={i18n.t('Back to action planning')}
                                      icon={<BackIcon/>}/>
                        </div>
                        <div className={classes.menu}>
                            <AdminMenu menu={menu}/>
                        </div>
                    </div>
                </div>
                <div className={classes['admin-content']}>
                        <Outlet/>
                </div>
        </div>
    )
}

