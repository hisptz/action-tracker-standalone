import {MenuItem} from '@dhis2/ui';
import React, {useMemo} from 'react';
import {MemoryRouter, Route, Switch, useHistory} from "react-router-dom";
import BackIcon from '@material-ui/icons/ArrowBack';
import AdminMenu from "./Components/Menu";
import ActionStatusLegendSettingsPage from "./Components/ActionStatusLegend";
import ChallengeMethodsSettingsPage from "./Components/ChallengeMethods";
import GeneralSettingsPage from "./Components/GeneralSettings";
import * as _ from 'lodash'
import i18n from '@dhis2/d2-i18n'
import classes from './admin.module.css'
import {useResetRecoilState} from "recoil";
import {DimensionsState} from "../../core/states";


export default function AdminPage() {
    const resetConfig = useResetRecoilState(DimensionsState)
    const menu = useMemo(() => [
        {
            pathname: '/general-settings',
            component: GeneralSettingsPage,
            label: i18n.t('General Settings')
        },
        {
            pathname: '/challenge-methods',
            component: ChallengeMethodsSettingsPage,
            label: i18n.t('Challenge Identification Methods')
        },
        {
            pathname: '/action-status-settings',
            component: ActionStatusLegendSettingsPage,
            label: i18n.t('Action Status Settings')
        },
    ], []);

    const history = useHistory();

    return (
        <div className={classes['admin-container']}>
            <MemoryRouter initialEntries={menu} initialIndex={0}>
                <div className={classes['side-menu']}>
                    <div className={classes['side-menu-container']}>
                        <div className={classes['back-menu-item']}>
                            <MenuItem onClick={_ =>{
                                resetConfig();
                                history.goBack()
                            }} label={i18n.t('Back to action planning')}
                                      icon={<BackIcon/>}/>
                        </div>
                        <div className={classes.menu} >
                            <AdminMenu menu={menu}/>
                        </div>
                    </div>
                </div>
                <div className={classes['admin-content']}>
                    <Switch>
                        {
                            _.map(menu, ({component, pathname}) => <Route key={pathname} component={component}
                                                                          path={pathname}
                                                                          exact/>)
                        }
                    </Switch>
                </div>
            </MemoryRouter>
        </div>
    )
}

