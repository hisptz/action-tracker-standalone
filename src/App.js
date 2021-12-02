import React from 'react'
import MainPage from "./modules/main";
import {RecoilRoot} from "recoil";
import {CssReset} from '@dhis2/ui'
import {HashRouter, Route, Switch,} from "react-router-dom";
import AdminPage from "./modules/admin";
import {DataStoreProvider} from "@dhis2/app-service-datastore";
import FullPageLoader from "./shared/Components/FullPageLoader";
import defaultGlobalSettings from './core/constants/defaultConfig.json'
import "./locales/index.js";
import classes from './App.module.css'

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

    return (
        <DataStoreProvider namespace={'Standalone_Action_Tracker'} loadingComponent={<FullPageLoader/>}
                           defaultGlobalSettings={defaultGlobalSettings}>
            <RecoilRoot>
                <CssReset/>
                <div className={classes['app-container']}>
                    <HashRouter initialEntries={modules} initialIndex={0}>
                        <Switch>
                            <Route path={`/admin`}>
                                <AdminPage/>
                            </Route>
                            <Route path={`/`}>
                                <MainPage/>
                            </Route>
                        </Switch>
                    </HashRouter>
                </div>
            </RecoilRoot>
        </DataStoreProvider>
    )
}
export default MyApp
