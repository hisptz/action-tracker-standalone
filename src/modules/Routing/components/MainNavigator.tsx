import React from "react"
import {Navigate} from "react-router-dom"

export function MainNavigator() {
    return (
        <Navigate to={`/welcome`}/>
    )
}
