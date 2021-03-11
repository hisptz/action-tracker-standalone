import React, {useState} from 'react'

import {Container, Grid} from "@material-ui/core";
import FilterComponents from './core/components/FilterComponents';
import './App.css'


const MyApp = () => {
    return (
        <Container className="app-container">
            <FilterComponents />
        </Container>
    )
}
export default MyApp
