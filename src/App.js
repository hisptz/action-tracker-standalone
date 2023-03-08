import React, {useMemo} from 'react'
import MainPage from "./modules/main";
import {RecoilRoot} from "recoil";
import {CssReset} from '@dhis2/ui'
import {HashRouter, Route, Routes,} from "react-router-dom";
import AdminPage from "./modules/admin";
import {DataStoreProvider} from "@dhis2/app-service-datastore";
import FullPageLoader from "./shared/Components/FullPageLoader";
import defaultGlobalSettings from './core/constants/defaultConfig.json'
import "./locales/index.js";
import classes from './App.module.css'
import * as _ from "lodash";
import GeneralSettingsPage from "./modules/admin/Components/GeneralSettings";
import ChallengeMethodsSettingsPage from "./modules/admin/Components/ChallengeMethods";
import ActionStatusLegendSettingsPage from "./modules/admin/Components/ActionStatusLegend";
import i18n from '@dhis2/d2-i18n';
const modules = [
    {
        pathname: '/',
    },
    {
        pathname: '/admin',
    }, {
        pathname: '/download/:type',
    }
]


const MyApp = () => {

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

    return (
        <DataStoreProvider namespace={'Standalone_Action_Tracker'} loadingComponent={<FullPageLoader/>}
                           defaultGlobalSettings={defaultGlobalSettings}>
            <RecoilRoot>
                <CssReset/>
                <div className={classes['app-container']}>
                    <HashRouter initialEntries={modules} initialIndex={0}>
                        <Routes>
                            <Route element={<AdminPage/>} path={`/admin`}>
                                {
                                    _.map(menu, ({component: Component, pathname}) => <Route key={pathname}
                                                                                             element={<Component/>}
                                                                                             path={pathname}
                                                                                             exact/>)
                                }
                            </Route>
                            <Route element={<MainPage/>} path={`/`}>

                            </Route>
                        </Routes>
                    </HashRouter>
                </div>
            </RecoilRoot>
        </DataStoreProvider>
    )
}
export default MyApp
