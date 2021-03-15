import Bottleneck from "../../../core/models/bottleneck";
import React from 'react';
import {Box, Button} from '@dhis2/ui';
import {Card, CardContent, Grid, Typography} from "@material-ui/core";
import IndicatorTable from "./Tables/IndicatorTable";
import ProgressIcon from '@material-ui/icons/BarChart';



export default function IndicatorCard({indicator = new Bottleneck()}) {
    const indicatorObject = indicator.toJson()
    return (
        <Grid item sm={12}>
            <Box height="600px">
                <Card variant='outlined'>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid container spacing={4} direction='row' item xs={12}>
                                <Grid item><Typography variant='h6'>{indicatorObject.indicator}</Typography></Grid>
                                <Grid item> <Button icon={<ProgressIcon/>}>View Progress</Button></Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Box height='500px' className='overflow'>
                                    <IndicatorTable indicator={indicatorObject}/>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
        </Grid>
    )
}
