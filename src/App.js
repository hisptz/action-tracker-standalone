import React from 'react'
import './App.css'
import MainPage from "./modules/main";
import {RecoilRoot} from "recoil";

const styles = {background: '#F8F9FA', margin: 0, padding: 0, height:'calc(100vh - 48px)'};



const MyApp = () => {
    return (
            <RecoilRoot>
                <div style={styles}>
                        <MainPage/>
                </div>
            </RecoilRoot>
    )
}
export default MyApp
