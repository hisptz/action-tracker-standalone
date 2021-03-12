import React from 'react'
import './App.css'
import MainPage from "./modules/main";
import {RecoilRoot} from "recoil";
import { CssReset } from '@dhis2/ui'

const styles = {margin: 0, padding: 0, height:'calc(100vh - 48px)'};

const MyApp = () => {
    return (
            <RecoilRoot>
                <CssReset/>
                <div style={styles}>
                        <MainPage/>
                </div>
            </RecoilRoot>
    )
}
export default MyApp
