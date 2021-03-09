import React, {useState} from 'react'
import PeriodFilter from "./shared/Components/PeriodFilter";
import {Button} from '@dhis2/ui'
import {Container, Grid} from "@material-ui/core";
import FilterComponents from './core/components/FilterComponents';
import './App.css'
import OrganisationUnitFilter from "./shared/Components/OrgUnitFilter";
import MainPage from "./modules/main";


const MyApp = () => {

    return (
            <Container maxWidth='xl' style={{background: '#F8F9FA', margin: 0, padding: 0, height: '100%'}}>
                <MainPage/>
            </Container>
    )
}
export default MyApp
