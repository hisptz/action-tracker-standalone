import React, {useEffect, Suspense, useState} from 'react';
import ChallengeList from "./Components/ChallengeList";
import FilterComponents from "../../core/components/FilterComponents";
import {useAppConfig} from "../../core/hooks";
import FullPageLoader from "../../shared/Components/FullPageLoader";
import {useSetRecoilState, useRecoilValue, useRecoilState} from "recoil";
import {DataEngineState, DimensionsState, DownloadPdfState} from "../../core/states";
import {useAlert, useDataEngine, useAlerts} from "@dhis2/app-runtime";
import useUser from "../../core/hooks/user";
import generateErrorAlert from "../../core/services/generateErrorAlert";
import Grid from "@material-ui/core/Grid";
import './styles/main.css';
import PDFTable from '../../shared/Components/Download/PDFTable';
import {getPDFDownloadData} from '../../core/services/downloadFilesService';
import {Container} from "@material-ui/core";


const styles = {
    container: {padding: 0, flexGrow: 1, height: 'calc(100vh - 48px)'},
    gridContainer: {flexGrow: 1, height: 'calc(100vh - 48px)'},
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
    const alerts = useAlerts();
    const [tablePDFDownloadData, setTablePDFDownloadData] = useState(undefined);
    const [downloadPdf, setDownloadPdf] = useRecoilState(DownloadPdfState);
    const {orgUnit} = useRecoilValue(DimensionsState);

    useEffect(() => {
        setDataEngine(engine)
    }, []);
    useEffect(() => generateErrorAlert(show, error), [error]);

    async function setUpPDFDownloadData() {
        const pdfData = await getPDFDownloadData({engine, orgUnit});
        setTablePDFDownloadData(pdfData);
    }

    if (downloadPdf && downloadPdf.isDownloadingPdf) {
        setUpPDFDownloadData();
        if (tablePDFDownloadData && tablePDFDownloadData.length) {
            alerts.forEach(alert=> alert.remove())
            setDownloadPdf({isDownloadingPdf: true, loading: false})
            window.onafterprint = (_) => {
                setDownloadPdf({isDownloadingPdf: false, loading: true})
            }
        } else if(tablePDFDownloadData === undefined) {
           /* show({message: 'Preparing a PDF file', type: 'INFO'}); */
        }
    }

    if(downloadPdf && downloadPdf.loading === false) { 
       window.print()
    }

    return (
        loading || firstTimeUseLoading || userLoading ?
            <div style={styles.container} id="mainPage"><FullPageLoader
                text={firstTimeUseLoading && 'Configuring for first time use. Please wait...'}/></div> :
            <Container maxWidth={false} id="mainPage" style={styles.container}>
                <Grid id="mainGrid" container style={styles.container} spacing={0} direction='column'>
                    <Grid item className="filter-components-grid">
                        <FilterComponents/>
                    </Grid>
                    <Grid item style={styles.dataContainer}>
                        <Suspense fallback={<FullPageLoader/>}>
                            <ChallengeList/>
                        </Suspense>
                    </Grid>
                </Grid>
                <PDFTable teiItems={tablePDFDownloadData}/>
            </Container>
    )
}
