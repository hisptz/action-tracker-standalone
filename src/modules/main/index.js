import React from 'react';
import {Container, Grid, Typography} from "@material-ui/core";
import IndicatorList from "./Components/IndicatorList";
import FilterComponents from "../../core/components/FilterComponents";
import MainPageHeader from "./Components/MainPageHeader";


export default function MainPage() {

    return (
        <Container maxWidth='xl' >
            <Grid container spacing={5}>
                <Grid item sm={12}>
                    <FilterComponents/>
                </Grid>
                <Grid item sm={12}>
                    <MainPageHeader/>
                </Grid>
                <Grid item sm={12}>
                    <IndicatorList/>
                </Grid>
            </Grid>
        </Container>
    )
}
