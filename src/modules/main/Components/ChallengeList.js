import React, {useEffect, useState, useCallback} from 'react';
import _ from 'lodash';
import {Container, Grid} from "@material-ui/core";
import ChallengeCard from "./ChallengeCard";
import {useRecoilValue, useSetRecoilState} from "recoil";
import { DimensionsState, DownloadPdfState, PageState, StatusFilterState} from "../../../core/states";
import NoDimensionsSelectedView from "./NoDimensionsSelectedView";
import MainPageHeader from "./MainPageHeader";
import EmptyChallengeList from "./EmptyChallengeList";
import FullPageLoader from "../../../shared/Components/FullPageLoader";
import {useAlert, useDataEngine, useDataQuery} from "@dhis2/app-runtime";
import Bottleneck from "../../../core/models/bottleneck";
import ChallengeDialog from "../../../shared/Dialogs/ChallengeDialog";
import {generateErrorAlert} from "../../../core/services/errorHandling.service";
import Paginator from "../../../shared/Components/Paginator";
import {CenteredContent} from '@dhis2/ui'
import useGetFilteredTeis from "../hooks/useGetFilteredTeis";
import FullPageError from "../../../shared/Components/FullPageError";
import {downloadExcel, getPdfDownloadData} from '../../../core/services/downloadFiles.service'
import {UserConfigState} from "../../../core/states/user";
import {BottleneckConstants} from "../../../core/constants";
import {TableStateSelector} from '../../../core/states/column'
import {usePDF} from '@react-pdf/renderer';
import PDFTable from '../../../shared/Components/Download/PDFTable';
import i18n from '@dhis2/d2-i18n'
const indicatorQuery = {
    indicators: {
        resource: 'trackedEntityInstances',
        params: ({ou, page, pageSize, trackedEntityInstance, ouMode}) => ({
            program: BottleneckConstants.PROGRAM_ID,
            page,
            pageSize,
            totalPages: true,
            ou,
            ouMode,
            fields: BottleneckConstants.FIELDS,
            trackedEntityInstance
        })
    }
}

const styles = {
    container: {
        paddingTop: 32,
        height: 'calc(100vh - 188px)',
        paddingLeft: 16,
        paddingRight: 16,
        minWidth: 1366
    },
    challengesContainer: {
        flexGrow: 1,
        minHeight: '100%',
        minWidth: 1366
    },
    mainHeaderContainer: {
        maxHeight: 120,
        padding: '8px 0'
    },
    card: {
        padding: '8px 0'
    },
    fullPage: {
        margin: 'auto',
        height: 'calc(100vh - 320px)',
        minWidth: 1366
    }
};

export default function ChallengeList() {
    const {orgUnit, period} = useRecoilValue(DimensionsState) || {};
    const {selected: selectedStatus} = useRecoilValue(StatusFilterState) || {};
    const {ouMode} = useRecoilValue(UserConfigState) || {};
    const {filteredTeis, loading: filteredTeisLoading} = useGetFilteredTeis(selectedStatus, orgUnit);
    const [page, setPage] = useState(1);
    const [downloadPdf, setDownloadPdf] = useState(false);
    const [pageSize, setPageSize] = useState(5);
    const {loading, data, error, refetch} = useDataQuery(indicatorQuery, {
        variables: {ou: orgUnit?.id, page, pageSize, trackedEntityInstance: [], ouMode},
        lazy: true
    });
    const [tablePDFDownloadData, setTablePDFDownloadData] = useState(undefined);
    const tableColumnsData = useRecoilValue(TableStateSelector)
    const currentTab = useRecoilValue(PageState);
    const engine = useDataEngine();
    const [addIndicatorOpen, setAddIndicatorOpen] = useState(false)
    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}))
    const [selectedChallenge, setSelectedChallenge] = useState(undefined);
    const setIsDownloadingPdf = useSetRecoilState(DownloadPdfState);
    const [expandedCardId, setExpandedCardId] = useState()
    const document = <PDFTable teiItems={tablePDFDownloadData} currentTab={currentTab}/>;
    const [instance, update] = usePDF({document});

    const [documentHasData, setDocumentHasData] = useState(false);
    useEffect(() => generateErrorAlert(show, error), [error])
    useEffect(()=>{
        function setInitialExpandedCard(){
            if(data?.indicators?.trackedEntityInstances){
                setExpandedCardId(_.head(data?.indicators?.trackedEntityInstances)?.trackedEntityInstance)
            }
        }
        setInitialExpandedCard();
    }, [data])
    useEffect(() => {
        function refresh() {
            if (orgUnit && !_.isEmpty(period)) {
                if (!selectedStatus) {
                    refetch({ou: orgUnit?.id, page, pageSize, trackedEntityInstance: [], ouMode: 'DESCENDANTS'})
                } else {
                    refetch({
                        ou: orgUnit?.id,
                        page,
                        pageSize,
                        trackedEntityInstance: filteredTeis.join(';'),
                        ouMode: 'DESCENDANTS'
                    })
                }
            }
        }

        refresh();
    }, [orgUnit, period, page, pageSize, selectedStatus, filteredTeisLoading, filteredTeis]);

    const onAddIndicator = useCallback(() => {
        refetch()
    }, [])

    const onPageChange = useCallback((newPage) => setPage(newPage), []);
    const onPageSizeChange = useCallback((newPageSize) => setPageSize(newPageSize), []);

    const onModalClose = useCallback((onClose) => {
        setSelectedChallenge(undefined);
        onClose();
    }, [])

    const onDownloadExcel = useCallback(()=>{
        show({message: i18n.t('Preparing an excel file'), type: {permanent: false}});
        downloadExcel({
            engine,
            orgUnit,
            tableColumnsData,
            currentTab,
            selectedPeriod: period,
        });
    }, [])

    const  onDownloadPDF = useCallback(()=>{
        setIsDownloadingPdf({isDownloadingPdf: true, loading: true});
        getPdfDownloadData({
            engine,
            orgUnit,
            tableColumnsData,
            currentTab,
            selectedPeriod: period,
        }).then((result) => {
            setTablePDFDownloadData(result);
            setDownloadPdf(true);
        });

        show({message: i18n.t('Preparing a PDF file'), type: {permanent: false}});
    }, [])

    const onEdit = useCallback((object) => {
        setSelectedChallenge(object);
        setAddIndicatorOpen(true);
    }, [])

    useEffect(() => {
        async function openDocument() {
            if (downloadPdf && tablePDFDownloadData) {
                await update();
                setDocumentHasData(true);
            }
        }

        openDocument();
    }, [downloadPdf, tablePDFDownloadData]);

    useEffect(() => {
        function openWindow() {
            setTimeout(() => {
                if (!instance?.loading && documentHasData) {
                    window.open(instance.url, '_blank');
                    setDownloadPdf(false)
                }
            }, 1000)

        }

        openWindow();
    }, [instance?.loading, tablePDFDownloadData, documentHasData]);

    return (orgUnit && period ?
            <Container style={styles.container} maxWidth={false}>
                <Grid container spacing={5} direction='column'>
                    <Grid item style={styles.mainHeaderContainer}>
                        <MainPageHeader
                            listIsEmpty={_.isEmpty(data?.indicators?.trackedEntityInstances)}
                            onDownloadExcel={onDownloadExcel}
                            onDownloadPDF={onDownloadPDF}
                            onAddIndicatorClick={_ => onModalClose(_ => setAddIndicatorOpen(true))}
                        />
                    </Grid>
                    {(loading || filteredTeisLoading) &&
                    <Grid item style={styles.fullPage}><FullPageLoader/></Grid>}
                    {((!loading || !filteredTeisLoading) && error) &&
                    <FullPageError error={error?.message || error?.toString()}/>}
                    {((!loading || !filteredTeisLoading) && !error && data) && <>
                        {
                            _.isEmpty(data.indicators?.trackedEntityInstances) ?
                                <Grid item style={styles.fullPage}> <EmptyChallengeList
                                    onAddIndicatorClick={_ => setAddIndicatorOpen(true)}/></Grid> :
                                <Grid id='challenge-list' item container spacing={0} direction='column' style={{minWidth: 1326, margin: 0}}>
                                    {
                                        _.map(data.indicators?.trackedEntityInstances, (trackedEntityInstance) => {
                                            const indicator = new Bottleneck(trackedEntityInstance);
                                            return (
                                                <Grid key={`${indicator.id}-grid`} item style={styles.card}>
                                                    <ChallengeCard expandedCardId={expandedCardId} setExpandedCardId={setExpandedCardId} onEdit={onEdit} refresh={refetch}
                                                                   key={`${indicator.id}-card`} indicator={indicator}/>
                                                </Grid>
                                            )
                                        })
                                    }
                                </Grid>
                        }
                        {
                            data?.indicators?.pager.pageCount > 1 &&
                            <Grid item>
                                <CenteredContent>
                                    <Paginator pager={data.indicators.pager} onPageChange={onPageChange}
                                               onPageSizeChange={onPageSizeChange}/>
                                </CenteredContent>
                            </Grid>
                        }
                        {
                            addIndicatorOpen &&
                            <ChallengeDialog challenge={selectedChallenge}
                                             onClose={_ => onModalClose(_ => setAddIndicatorOpen(false))}
                                             onUpdate={onAddIndicator}/>

                        }
                    </>
                    }
                </Grid>
            </Container> : <NoDimensionsSelectedView/>
    )
}
