import React from 'react';
import {Container, Grid, Typography} from "@material-ui/core";
import IndicatorList from "./Components/IndicatorList";
import FilterComponents from "../../core/components/FilterComponents";
import MainPageHeader from "./Components/MainPageHeader";
import {useAppConfig} from "../../core/hooks";
import FullPageLoader from "../../shared/Components/FullPageLoader";


const styles = {
    container: {padding: 20, margin: 0, minHeight: '100%', minWidth: 'calc(100vw - 4px)'},
    gridContainer: {height: 'calc(100vh - 260px)'},

}

export default function MainPage() {
    const {loading, firstTimeUseLoading} = useAppConfig();
    return (
        loading || firstTimeUseLoading ?
            <FullPageLoader text={firstTimeUseLoading && 'Configuring for first time use. Please wait...'} /> :
            <Container style={styles.container}>
                <Grid container spacing={5} style={styles.gridContainer}>
                    <Grid item xs={12} style={{padding: 0}}>
                        <FilterComponents/>
                    </Grid>
                    <Grid container item xs={12}>
                        <IndicatorList/>
                    </Grid>
                </Grid>
            </Container>
    )
}
