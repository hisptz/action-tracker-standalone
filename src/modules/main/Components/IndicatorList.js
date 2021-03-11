import React from 'react';
import _ from 'lodash';
import {Grid} from "@material-ui/core";
import IndicatorCard from "./IndicatorCard";
import {useRecoilValue} from "recoil";
import {DimensionsState} from "../../../core/states";
import NoDimensionsSelectedView from "./NoDimensionsSelectedView";
import MainPageHeader from "./MainPageHeader";
import EmptyIndicatorList from "./EmptyIndicatorList";

export default function IndicatorList() {
    const {orgUnit, period} = useRecoilValue(DimensionsState);

    const indicatorList = ['Indicator 1'];

    return (orgUnit && period ? indicatorList.length > 0 ?
            <Grid container spacing={3} direction='column'>
                <Grid item xs={12} style={{maxHeight: 120}} justify='center'>
                    <MainPageHeader/>
                </Grid>
                {
                    _.map(indicatorList, (indicator) => <IndicatorCard indicator={indicator}/>)

                }
            </Grid> : <EmptyIndicatorList/> : <NoDimensionsSelectedView/>
    )
}
