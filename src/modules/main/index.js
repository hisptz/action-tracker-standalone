import React, {useEffect, Suspense} from 'react';
import ChallengeList from "./Components/ChallengeList";
import FilterComponents from "../../core/components/FilterComponents";
import {useAppConfig} from "../../core/hooks";
import FullPageLoader from "../../shared/Components/FullPageLoader";
import {useSetRecoilState} from "recoil";
import {DataEngineState} from "../../core/states";
import {useAlert, useDataEngine} from "@dhis2/app-runtime";
import useUser from "../../core/hooks/user";
import generateErrorAlert from "../../core/services/generateErrorAlert";
import Grid from "@material-ui/core/Grid";


const styles = {
    container: {flexGrow: 1, height: 'calc(100vh - 48px)'},
    filterContainer: {
        width: '100%',
        maxHeight: 130
    },
    dataContainer: {
        flexGrow: 1,
    }

}

export default function MainPage() {
    const {loading, firstTimeUseLoading} = useAppConfig();
    const {loading: userLoading, error} = useUser();
    const engine = useDataEngine();
    const setDataEngine = useSetRecoilState(DataEngineState);
    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}))

    useEffect(() => {
        setDataEngine(engine)
    }, []);
    useEffect(() => generateErrorAlert(show, error), [error])

    return (
        loading || firstTimeUseLoading || userLoading ?
            <div style={styles.container}><FullPageLoader
                text={firstTimeUseLoading && 'Configuring for first time use. Please wait...'}/></div> :
            <Grid container style={styles.container} spacing={0} direction='column'>
                <Grid item>
                    <FilterComponents/>
                </Grid>
                <Grid item style={styles.dataContainer}>
                    <Suspense fallback={<FullPageLoader/>}>
                        <ChallengeList/>
                    </Suspense>
                </Grid>
            </Grid>
    )
}
