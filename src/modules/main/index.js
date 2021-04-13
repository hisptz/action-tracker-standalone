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
  container: {
    padding: 20,
    margin: 0,
    minHeight: '100%',
    minWidth: 'calc(100vw - 4px)',
  },
  gridContainer: { height: 'calc(100vh - 260px)' },
  fullHeight: {
    height: '100%',
  },
};

export default function MainPage() {
  const { loading, firstTimeUseLoading } = useAppConfig();
  const [tablePDFDownloadData, setTablePDFDownloadData] = useState([]);
  const engine = useDataEngine();
  const setDataEngine = useSetRecoilState(DataEngineState);

  const [downloadPdf, setDownloadPdf] = useRecoilState(DownloadPdfState);

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
