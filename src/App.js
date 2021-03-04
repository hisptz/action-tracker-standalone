import React, {useState} from 'react'
import classes from './App.module.css'
import PeriodFilter from "./shared/Components/PeriodFilter";
import {Button} from '@dhis2/ui'
import {Container, Grid} from "@material-ui/core";
import OrganisationUnitFilter from "./shared/Components/OrgUnitFilter";


const MyApp = () => {
    const [openPeriodFilter, setOpenPeriodFilter] = useState(false);
    const [openOrgUnitFilter, setOrgUnitFilter] = useState(false);

    return (
        <Container style={{height: '100%'}} >
            <Grid container spacing={4} style={{height: '100%'}} justify='center' >
                <Grid item sm style={{margin: 'auto'}}>
                    <Button onClick={_ => setOpenPeriodFilter(true)} primary>Open Period Filter</Button>
                </Grid>
                <Grid item sm style={{margin: 'auto'}}>
                    <Button onClick={_ => setOrgUnitFilter(true)} primary>Open Organisation Unit Filter</Button>
                </Grid>
            </Grid>
            {openPeriodFilter && <PeriodFilter onClose={_ => setOpenPeriodFilter(false)}/>}
            {openOrgUnitFilter && <OrganisationUnitFilter onClose={_ => setOrgUnitFilter(false)}/>}
        </Container>
    )
}
export default MyApp
