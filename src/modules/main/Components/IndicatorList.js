import React from 'react';
import _ from 'lodash';
import {Container, Grid} from "@material-ui/core";
import IndicatorCard from "./IndicatorCard";

export default function IndicatorList({}) {

    const indicatorList = [
        'Indicator 1',
        'Indicator 2'
    ];


    return(
        <Container maxWidth='xl'>
            <Grid container spacing={3}>
                {
                    _.map(indicatorList, (indicator)=><IndicatorCard indicator={indicator} />)
                }
            </Grid>
        </Container>
    )




}
