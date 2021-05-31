import React, {useEffect, Suspense} from 'react';
import ChallengeList from "./Components/ChallengeList";
import FilterComponents from "../../core/Components/FilterComponents";
import FullPageLoader from "../../shared/Components/FullPageLoader";
import {useAlert} from "@dhis2/app-runtime";
import {generateErrorAlert} from "../../core/services/errorHandling.service";
import Grid from "@material-ui/core/Grid";
import './styles/main.css';
import {Container} from "@material-ui/core";
import FullPageError from "../../shared/Components/FullPageError";
import useAllConfig from "../../core/hooks/config";
import NoConfigPage from "./Components/NoConfigPage";
import i18n from '@dhis2/d2-i18n'

const styles = {
    container: {padding: 0, flexGrow: 1, height: 'calc(100vh - 48px)'},
    gridContainer: {flexGrow: 1, height: 'calc(100vh - 48px)'},
    filterContainer: {
        width: '100%',
    },
    dataContainer: {
        flexGrow: 1,
    }
}

export default function MainPage() {
    const {loading, error, firstTimeUseLoading, noConfig} = useAllConfig();
    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}))

    useEffect(() => generateErrorAlert(show, error), [error]);

    return (
        loading || firstTimeUseLoading ?
            <div style={styles.container} id="mainPage"><FullPageLoader
                text={firstTimeUseLoading && i18n.t('Configuring for first time use. Please wait...')}/></div> :
            error ? <FullPageError error={error?.message || error.toString()}/> :
                noConfig ? <div style={styles.container} id="mainPage"><NoConfigPage/></div> :
                    <Container maxWidth={false} id="mainPage" style={styles.container}>
                        <Grid id="mainGrid" container style={styles.gridContainer} spacing={0} direction='column'>
                            <Grid item className="filter-components-grid" style={styles.filterContainer}>
                                <FilterComponents/>
                            </Grid>
                            <Grid item style={styles.dataContainer}>
                                <Suspense fallback={<FullPageLoader/>}>
                                    <ChallengeList/>
                                </Suspense>
                            </Grid>
                        </Grid>
                    </Container>
    )

}
