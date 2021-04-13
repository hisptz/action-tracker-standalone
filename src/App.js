import React from 'react'
import './App.css'
import MainPage from "./modules/main";
import {RecoilRoot} from "recoil";
import {CssReset} from '@dhis2/ui'
import {Container} from "@material-ui/core";

const styles = {margin: 0, padding: 0, minHeight: 'calc(100vh - 48px)', minWidth: 'calc(100vw - 4px)', flex: 1};

const MyApp = () => {
    return (
        <RecoilRoot>
            <CssReset/>
            <Container style={styles}>
                <MainPage/>
            </Container>
        </RecoilRoot>
    )
}
export default MyApp
