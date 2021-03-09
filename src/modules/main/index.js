import React from 'react';
import {Container, Grid} from "@material-ui/core";
import IndicatorList from "./Components/IndicatorList";
import FilterComponents from "../../core/components/FilterComponents";


export default function MainPage() {

    return (
        <Grid container spacing={5}>
            <Grid item sm={12}>
                <FilterComponents/>
            </Grid>
            <Grid item sm={12}>
                <IndicatorList/>
            </Grid>
        </Grid>
    )
}
