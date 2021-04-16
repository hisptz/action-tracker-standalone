import React, {useEffect, useState} from 'react';
import _ from 'lodash';
import {Container, Grid} from "@material-ui/core";
import ChallengeCard from "./ChallengeCard";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {DataEngineState, DimensionsState, DownloadPdfState, PageState, StatusFilterState} from "../../../core/states";
import NoDimensionsSelectedView from "./NoDimensionsSelectedView";
import MainPageHeader from "./MainPageHeader";
import EmptyChallengeList from "./EmptyChallengeList";
import FullPageLoader from "../../../shared/Components/FullPageLoader";
import {useAlert, useDataQuery} from "@dhis2/app-runtime";
import Bottleneck from "../../../core/models/bottleneck";
import ChallengeDialog from "../../../shared/Dialogs/ChallengeDialog";
import generateErrorAlert from "../../../core/services/generateErrorAlert";
import Paginator from "../../../shared/Components/Paginator";
import {CenteredContent} from '@dhis2/ui'
import useGetFilteredTeis from "../hooks/useGetFilteredTeis";
import FullPageError from "../../../shared/Components/FullPageError";
import {downloadExcel} from '../../../core/services/downloadFilesService'
import {UserConfigState} from "../../../core/states/user";
import {BottleneckConstants} from "../../../core/constants";

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
            fields: [
                'trackedEntityInstance',
                'attributes[attribute,value]',
                'enrollments[events[programStage,event,dataValues[dataElement,value]]]'
            ],
            trackedEntityInstance
        })
    }
}

const styles = {
    container: {
        paddingTop: 30,
        height: 'calc(100vh - 188px)',
        paddingLeft: 20,
        paddingRight: 20
    },
    challengesContainer: {
        flexGrow: 1,
        minHeight: '100%'
    },
    mainHeaderContainer: {
        maxHeight: 120,
        padding: '10px 0'
    },
    card: {
        padding: '30px 0'
    },
    fullPage: {
        margin: 'auto',
        height: 'calc(100vh - 320px)'
    }
};

export default function ChallengeList() {
    const {orgUnit, period} = useRecoilValue(DimensionsState) || {};
    const {selected: selectedStatus} = useRecoilValue(StatusFilterState) || {};
    const {ouMode} = useRecoilValue(UserConfigState) || {};
    const {filteredTeis, loading: filteredTeisLoading} = useGetFilteredTeis(selectedStatus, orgUnit);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const {loading, data, error, refetch} = useDataQuery(indicatorQuery, {
        variables: {ou: orgUnit?.id, page, pageSize, trackedEntityInstance: [], ouMode},
        lazy: true
    });
    const engine = useRecoilValue(DataEngineState);
    const [addIndicatorOpen, setAddIndicatorOpen] = useState(false)
    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}))
    useEffect(() => generateErrorAlert(show, error), [error])

    useEffect(() => {
        function refresh() {
            if (orgUnit && !_.isEmpty(period)) {
                if (!selectedStatus) {
                    refetch({ou: orgUnit?.id, page, pageSize, trackedEntityInstance: []})
                } else {
                    refetch({ou: orgUnit?.id, page, pageSize, trackedEntityInstance: filteredTeis.join(';')})
                }
            }
        }
        refresh();
    }, [orgUnit, period, page, pageSize, selectedStatus, filteredTeisLoading, filteredTeis]);

    const onAddIndicator = () => {
        refetch()
    }

    const onPageChange = (newPage) => setPage(newPage);
    const onPageSizeChange = (newPageSize) => setPageSize(newPageSize);

    const [selectedChallenge, setSelectedChallenge] = useState(undefined);
    const setIsDownloadingPdf = useSetRecoilState(DownloadPdfState);

    const onModalClose = (onClose) => {
        setSelectedChallenge(undefined);
        onClose();
    }

    function onDownloadExcel() {
        downloadExcel({engine, indicatorQuery, orgUnit})
    }

    function onDownloadPDF() {
        setIsDownloadingPdf({isDownloadingPdf: true, loading: true})

       show({message: 'Preparing a PDF file', type: {permanent: true}});

    }

    const onEdit = (object) => {
        setSelectedChallenge(object);
        setAddIndicatorOpen(true);
    }
    return (orgUnit && period ?
            <Container style={styles.container} maxWidth={false}>
                <Grid container spacing={5} direction='column'>
                    <Grid item style={styles.mainHeaderContainer}>
                        <MainPageHeader
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
                                <Grid item container spacing={0} direction='column'>
                                    {
                                        _.map(data.indicators?.trackedEntityInstances, (trackedEntityInstance) => {
                                            const indicator = new Bottleneck(trackedEntityInstance);
                                            return (
                                                <Grid key={`${indicator.id}-grid`} item style={styles.card}>
                                                    <ChallengeCard onEdit={onEdit} refresh={refetch}
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
