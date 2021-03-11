import React from 'react';
import _ from 'lodash';
import {Grid} from "@material-ui/core";
import IndicatorCard from "./IndicatorCard";
import {useRecoilValue} from "recoil";
import {DimensionsState} from "../../../core/states";
import NoDimensionsSelectedView from "./NoDimensionsSelectedView";
import MainPageHeader from "./MainPageHeader";

export default function IndicatorList() {
    const {orgUnit, period} = useRecoilValue(DimensionsState);

    const indicatorList = [
        'Indicator 1',
        'Indicator 2'
    ];

    return (orgUnit && period ?
            <Grid container spacing={3} direction='column'>
                <Grid item xs={12} style={{maxHeight: 76}} justify='center'>
                    <MainPageHeader/>
                </Grid>
                {
                    _.map(indicatorList, (indicator) => <IndicatorCard indicator={indicator}/>)

                }
            </Grid> : <NoDimensionsSelectedView/>
    )


}
