import React from "react"
import {DimensionFilterArea} from "./components/DimensionFilterArea";
import {Header} from "./components/Header/Header";
import {MainArea} from "./components/MainArea";

export function Main() {

    return (
        <div className="column w-100 h-100 gap-16">
            <DimensionFilterArea/>
            <div className="ph-16">
                <Header/>
            </div>
            <div style={{flexGrow: 1}}>
                <MainArea/>
            </div>
        </div>
    )
}
