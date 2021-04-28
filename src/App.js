import React from 'react'
import './App.css'
import MainPage from "./modules/main";
import {RecoilRoot} from "recoil";
import {CssReset} from '@dhis2/ui'
import {Container} from "@material-ui/core";
import {
    MemoryRouter,
    Switch,
    Route,
} from "react-router-dom";
import AdminPage from "./modules/admin";
import {DataStoreProvider} from "@dhis2/app-service-datastore";
import FullPageLoader from "./shared/Components/FullPageLoader";
import defaultGlobalSettings from './core/constants/defaultConfig.json'

const styles = {
    margin: 0,
    overflowX: 'auto',
    padding: 0,
    minHeight: 'calc(100vh - 48px)',
    minWidth: 'calc(100vw - 4px)',
    flex: 1
};

const MyApp = () => {

    const modules = [
        {
            pathname: '/',
        },
        {
            pathname: '/admin',
        }
    ]

    return (
        <RecoilRoot>
            <CssReset/>
            <DataStoreProvider namespace={'Standalone_Action_Tracker'} loadingComponent={<FullPageLoader/>}
                               defaultGlobalSettings={defaultGlobalSettings}>
                <Container style={styles}>
                    <MemoryRouter initialEntries={modules} initialIndex={0}>
                        <Switch>
                            <Route path={`/admin`}>
                                <AdminPage/>
                            </Route>
                            <Route path={`/`}>
                                <MainPage/>
                            </Route>
                        </Switch>
                    </MemoryRouter>
                </Container>
            </DataStoreProvider>
        </RecoilRoot>
    )
}
export default MyApp
