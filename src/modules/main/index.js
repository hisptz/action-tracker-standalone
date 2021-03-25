import React, {useEffect} from 'react';
import {Container, Grid} from "@material-ui/core";
import ChallengeList from "./Components/ChallengeList";
import FilterComponents from "../../core/components/FilterComponents";
import {useAppConfig} from "../../core/hooks";
import FullPageLoader from "../../shared/Components/FullPageLoader";
import {useSetRecoilState} from "recoil";
import {DataEngineState} from "../../core/states";
import {useDataEngine} from "@dhis2/app-runtime";


const styles = {
    container: {padding: 20, margin: 0, minHeight: '100%', minWidth: 'calc(100vw - 4px)'},
    gridContainer: {height: 'calc(100vh - 260px)'},
    fullHeight:{
        height: '100%'
    }

}

export default function MainPage() {
    const {loading, firstTimeUseLoading} = useAppConfig();
    const engine = useDataEngine();
    const setDataEngine = useSetRecoilState(DataEngineState);

    useEffect(()=>{setDataEngine(engine)}, []);

    return (
        loading || firstTimeUseLoading ?
            <FullPageLoader text={firstTimeUseLoading && 'Configuring for first time use. Please wait...'} /> :
            <Container style={styles.container}>
                <Grid container spacing={5} style={styles.gridContainer}>
                    <Grid item xs={12} style={{padding: 0}}>
                        <FilterComponents/>
                    </Grid>
                    <Grid container item xs={12} style={styles.fullHeight}>
                        <ChallengeList/>
                    </Grid>
                </Grid>
            </Container>
    )
}
