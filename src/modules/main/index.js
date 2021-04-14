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

import React, { useEffect, useState } from 'react';
import { Container, Grid } from '@material-ui/core';
import ChallengeList from './Components/ChallengeList';
import FilterComponents from '../../core/components/FilterComponents';
import { useAppConfig } from '../../core/hooks';
import FullPageLoader from '../../shared/Components/FullPageLoader';
import { useSetRecoilState, useRecoilValue, useRecoilState } from 'recoil';
import { DataEngineState, DimensionsState, DownloadPdfState } from '../../core/states';
import { useDataEngine } from '@dhis2/app-runtime';
import './styles/main.css';
import PDFTable from '../../shared/Components/Download/PDFTable';
import { getPDFDownloadData } from '../../core/services/downloadFilesService';

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
  const { loading, firstTimeUseLoading } = useAppConfig();
  const [tablePDFDownloadData, setTablePDFDownloadData] = useState([]);
  const engine = useDataEngine();
  const setDataEngine = useSetRecoilState(DataEngineState);

    useEffect(() => {
        setDataEngine(engine)
    }, []);
    useEffect(() => generateErrorAlert(show, error), [error])
  const [downloadPdf, setDownloadPdf] = useRecoilState(DownloadPdfState);

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
  const { orgUnit } = useRecoilValue(DimensionsState);

  async function setUpPDFDownloadData() {
    const pdfData = await getPDFDownloadData({ engine, orgUnit });
    setTablePDFDownloadData(pdfData);
  }
  if(downloadPdf && downloadPdf.isDownloadingPdf) {
    setUpPDFDownloadData();
    if(tablePDFDownloadData && tablePDFDownloadData.length) {

      window.onafterprint = (event) => {
        setDownloadPdf({isDownloadingPdf: false})
      }
    } else {
      console.log('waiting');
    }
  }

  useEffect(() => {
    setDataEngine(engine);
  }, []);

  return loading || firstTimeUseLoading ? (
    <FullPageLoader
      text={
        firstTimeUseLoading && 'Configuring for first time use. Please wait...'
      }
    />
  ) : (
    <Container style={styles.container} id="mainPage">
      <Grid id="mainGrid" container spacing={5} style={styles.gridContainer}>
        <Grid
          item
          xs={12}
          style={{ padding: 0 }}
          className="filter-components-grid"
        >
          <FilterComponents />
        </Grid>
        <Grid container item xs={12} style={styles.fullHeight}>
          <ChallengeList  />
        </Grid>
      </Grid>
       <PDFTable teiItems={tablePDFDownloadData} />
    </Container>
  );
}
