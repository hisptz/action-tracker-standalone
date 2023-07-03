import React from "react";
import {SideMenu} from "./components/SideMenu";
import {Outlet} from "react-router-dom";

export function Config() {
    return (
        <main className="w-100 h-100 row">
            <SideMenu/>
            <div className="w-100 h-100" style={{flexGrow: 1}}>
                <Outlet/>
            </div>
        </main>
    )
}
