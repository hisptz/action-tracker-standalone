import {Container, Grid, Typography} from "@material-ui/core";
import React from "react";


export default function MainPageHeader(){

    return(
        <Container maxWidth='xl' >
            <Grid container >
                <Grid item >
                    <Typography variant='h5'><b>Action {'Planning'}</b></Typography>
                </Grid>
            </Grid>
        </Container>
    )
}
