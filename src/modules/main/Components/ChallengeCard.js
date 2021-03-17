import Bottleneck from "../../../core/models/bottleneck";
import React, {useEffect} from 'react';
import {Box, Button, CenteredContent, CircularLoader} from '@dhis2/ui';
import {Card, CardContent, Grid, Typography} from "@material-ui/core";
import ChallengeTable from "./Tables/ChallengeTable";
import ProgressIcon from '@material-ui/icons/BarChart';
import {useIndicatorsName} from "../../../core/hooks/indicators";
import generateErrorAlert from "../../../core/services/generateErrorAlert";
import {useAlert} from "@dhis2/app-runtime";


export default function ChallengeCard({indicator = new Bottleneck()}) {
    const indicatorObject = indicator.toJson();
    const {loading, error, name} = useIndicatorsName(indicatorObject.indicator);
    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}))
    useEffect(() => generateErrorAlert(show, error), [error]);

    return (
        <Grid item sm={12}>
            <Box height="600px">
                <Card variant='outlined'>
                    <CardContent>
                        {
                            loading ?
                                <CenteredContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Box height='500px' width={'100%'} className='overflow'>
                                                <CenteredContent>
                                                    <CircularLoader/>
                                                </CenteredContent>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </CenteredContent> :
                                <Grid container spacing={2}>
                                    <Grid container spacing={4} direction='row' item xs={12}>
                                        <Grid item><Typography
                                            variant='h6'>{name}</Typography></Grid>
                                        <Grid item> <Button icon={<ProgressIcon/>}>View Progress</Button></Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box height='500px' className='overflow'>
                                            <ChallengeTable indicator={indicatorObject}/>
                                        </Box>
                                    </Grid>
                                </Grid>
                        }
                    </CardContent>
                </Card>
            </Box>
        </Grid>
    )
}
