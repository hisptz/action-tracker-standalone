<<<<<<< HEAD
import React from 'react'
import './App.css'
import MainPage from "./modules/main";
import {RecoilRoot} from "recoil";
import { CssReset } from '@dhis2/ui'
=======
import React, {useState} from 'react'

import {Container, Grid} from "@material-ui/core";
import FilterComponents from './core/components/FilterComponents';
import './App.css'
>>>>>>> feature/header-components

const styles = {margin: 0, padding: 0, height:'calc(100vh - 48px)'};

const MyApp = () => {
    return (
<<<<<<< HEAD
            <RecoilRoot>
                <CssReset/>
                <div style={styles}>
                        <MainPage/>
                </div>
            </RecoilRoot>
=======
        <Container className="app-container">
            <FilterComponents />
        </Container>
>>>>>>> feature/header-components
    )
}
export default MyApp
