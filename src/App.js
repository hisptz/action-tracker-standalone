import React, {useState} from 'react'
import PeriodFilter from "./shared/Components/PeriodFilter";
import {Button} from '@dhis2/ui'
import {Container, Grid} from "@material-ui/core";
import FilterComponents from './core/components/FilterComponents';
import './App.css'

const query = {
    me: {
        resource: 'me',
    },
}

const MyApp = () => {
    // const [openPeriodFilter, setOpenPeriodFilter] = useState(false);
    // const [openOrgUnitFilter, setOrgUnitFilter] = useState(false);

    // const onUpdate = (data) => console.log(data)

    return (
        <Container className="app-container">
            <FilterComponents />
            {/* <Grid container spacing={4} style={{height: '100%'}} justify='center'>
                <Grid item sm style={{margin: 'auto'}}>
                    <Button onClick={_ => setOpenPeriodFilter(true)} primary>Open Period Filter</Button>
                </Grid>
                <Grid item sm style={{margin: 'auto'}}>
                    <Button onClick={_ => setOrgUnitFilter(true)} primary>Open Organisation Unit Filter</Button>
                </Grid>
            </Grid>
            {openPeriodFilter && <PeriodFilter onClose={_ => setOpenPeriodFilter(false)} onUpdate={onUpdate}/>}
            {openOrgUnitFilter && <OrganisationUnitFilter onClose={_ => setOrgUnitFilter(false)} onUpdate={onUpdate}/>} */}
        </Container>
    )
}
export default MyApp
