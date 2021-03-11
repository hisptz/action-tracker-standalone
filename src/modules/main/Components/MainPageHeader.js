import {Button, ButtonGroup, Card, Container, Grid, Typography} from "@material-ui/core";
import React from "react";
import {useRecoilState} from "recoil";
import {DimensionsState} from "../../../core/states";


const PageSelector = () => {
    const [{activePage}, setDimensions] = useRecoilState(DimensionsState);

    const styles = {
        active: {
            background: '#046441',
            color: '#fff',
            textTransform: 'none'
        },
        inactive:{
            textTransform: 'none'
        }
    }
    console.log(activePage);

    const onClick = (page) => setDimensions((dimensions) => ({...dimensions, activePage: page}))

    return (
        <ButtonGroup>
            <Button onClick={_ => onClick('Planning')}
                    style={activePage === 'Planning' ? styles.active : styles.inactive}>Planning</Button>
            <Button style={activePage === 'Tracking' ? styles.active : styles.inactive} onClick={_ => onClick('Tracking')}
            >Tracking</Button>
        </ButtonGroup>
    )
}

export default function MainPageHeader() {

    return (
        <Container maxWidth='xl'>
            <Grid container>
                <Grid item container xs={6} lg={4} spacing={3}>
                    <Grid item><Typography variant='h5'
                                           style={{color: '#6E7A8A'}}><b>Action {'Planning'}</b></Typography></Grid>
                    <Grid item> <PageSelector/></Grid>
                </Grid>
            </Grid>
        </Container>
    )
}
