import React, {useEffect, Suspense, useState} from 'react';
import ChallengeList from "./Components/ChallengeList";
import FilterComponents from "../../core/components/FilterComponents";
import FullPageLoader from "../../shared/Components/FullPageLoader";
import {useSetRecoilState, useRecoilValue, useRecoilState} from "recoil";
import {DataEngineState, DimensionsState, DownloadPdfState, PageState} from "../../core/states";
import {TableStateSelector} from "../../core/states/column";
import {useAlert, useDataEngine, useAlerts} from "@dhis2/app-runtime";
import generateErrorAlert from "../../core/services/generateErrorAlert";
import Grid from "@material-ui/core/Grid";
import './styles/main.css';
import PDFTable from '../../shared/Components/Download/PDFTable';
import {getPDFDownloadData} from '../../core/services/downloadFilesService';
import {Container} from "@material-ui/core";
import FullPageError from "../../shared/Components/FullPageError";
import useAllConfig from "../../core/hooks/config";
import NoConfigPage from "./Components/NoConfigPage";


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
    const engine = useDataEngine();
    const setDataEngine = useSetRecoilState(DataEngineState);
    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}))
    const alerts = useAlerts();
    const [tablePDFDownloadData, setTablePDFDownloadData] = useState(undefined);
    const [downloadPdf, setDownloadPdf] = useRecoilState(DownloadPdfState);
    const {orgUnit, period} = useRecoilValue(DimensionsState);
    const currentTab = useRecoilValue(PageState);
    const tableColumnsData = useRecoilValue(TableStateSelector)


    useEffect(() => {
        setDataEngine(engine)
    }, []);
    useEffect(() => generateErrorAlert(show, error), [error]);

    async function setUpPDFDownloadData() {
        const pdfData = await getPDFDownloadData({
            engine,
            orgUnit,
            currentTab,
            selectedPeriod: period,
            tableColumnsData
        });
        setTablePDFDownloadData(pdfData);
    }

    if (downloadPdf && downloadPdf.isDownloadingPdf) {
        setUpPDFDownloadData();
        if (tablePDFDownloadData && tablePDFDownloadData.length) {
            alerts.forEach(alert => alert.remove())
            setDownloadPdf({isDownloadingPdf: true, loading: false})
            window.onafterprint = (_) => {
                setDownloadPdf({isDownloadingPdf: false, loading: true})
            }
        } else if (tablePDFDownloadData === undefined) {
            /* show({message: 'Preparing a PDF file', type: 'INFO'}); */
        }
    }
    if (downloadPdf && downloadPdf.loading === false) {
        window.print()
    }

    return (
        loading || firstTimeUseLoading ?
            <div style={styles.container} id="mainPage"><FullPageLoader
                text={firstTimeUseLoading && 'Configuring for first time use. Please wait...'}/></div> :
            error ? <FullPageError error={error?.message || error.toString()}/> :
                noConfig ? <div style={styles.container} id="mainPage" ><NoConfigPage/></div> :
                    <Container maxWidth={false} id="mainPage" style={styles.container}>
                        <Grid id="mainGrid" container style={styles.container} spacing={0} direction='column'>
                            <Grid item className="filter-components-grid" style={styles.filterContainer}>
                                <FilterComponents/>
                            </Grid>
                            <Grid item style={styles.dataContainer}>
                                <Suspense fallback={<FullPageLoader/>}>
                                    <ChallengeList/>
                                </Suspense>
                            </Grid>
                        </Grid>
                        {downloadPdf?.isDownloadingPdf && <PDFTable teiItems={tablePDFDownloadData}/>}
                    </Container>
    )
}
