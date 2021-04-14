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

const styles = {margin: 0, padding: 0, minHeight: 'calc(100vh - 48px)', minWidth: 'calc(100vw - 4px)', flex: 1};

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
            <Container style={styles}>
                <MemoryRouter initialEntries={modules} initialIndex={0} >
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
        </RecoilRoot>
    )
}
export default MyApp
