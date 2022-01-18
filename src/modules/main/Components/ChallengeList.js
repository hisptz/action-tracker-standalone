import React, {useCallback, useEffect, useState} from 'react';
import _, {sortBy} from 'lodash';
import ChallengeCard from "./ChallengeCard";
import {useRecoilCallback, useRecoilState, useRecoilValue} from "recoil";
import {DimensionsState, StatusFilterState} from "../../../core/states";
import NoDimensionsSelectedView from "./NoDimensionsSelectedView";
import MainPageHeader from "./MainPageHeader";
import EmptyChallengeList from "./EmptyChallengeList";
import FullPageLoader from "../../../shared/Components/FullPageLoader";
import {useAlert, useDataQuery} from "@dhis2/app-runtime";
import Bottleneck from "../../../core/models/bottleneck";
import ChallengeDialog from "../../../shared/Dialogs/ChallengeDialog";
import {generateErrorAlert} from "../../../core/services/errorHandling.service";
import Paginator from "../../../shared/Components/Paginator";
import {CenteredContent} from '@dhis2/ui'
import useGetFilteredTeis from "../hooks/useGetFilteredTeis";
import FullPageError from "../../../shared/Components/FullPageError";
import {UserConfigState} from "../../../core/states/user";
import {BottleneckConstants} from "../../../core/constants";
import i18n from '@dhis2/d2-i18n'
import classes from '../main.module.css'
import useDownload from "../hooks/useDownload";
import {DownloadActive, DownloadType} from "./Download/state/download";
import Download from "./Download";

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
            trackedEntityInstance,
            order: 'created:asc',
        })
    }
}

export default function ChallengeList() {
    const {orgUnit, period} = useRecoilValue(DimensionsState) || {};
    const {selected: selectedStatus} = useRecoilValue(StatusFilterState) || {};
    const {ouMode} = useRecoilValue(UserConfigState) || {};
    const {filteredTeis, loading: filteredTeisLoading} = useGetFilteredTeis(selectedStatus, orgUnit);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const {loading, data, error, refetch} = useDataQuery(indicatorQuery, {
        variables: {ou: orgUnit?.id, page, pageSize, trackedEntityInstance: [], ouMode},
        lazy: true
    });
    const [addIndicatorOpen, setAddIndicatorOpen] = useState(false)
    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}))
    const [selectedChallenge, setSelectedChallenge] = useState(undefined);
    const [expandedCardId, setExpandedCardId] = useState()
    const {onDownload, downloadRef} = useDownload()
    const [downloadActive, setDownloadActive] = useRecoilState(DownloadActive)
    const sortedData = sortBy(data?.indicators?.trackedEntityInstances, (item) => new Date(item.created));

    useEffect(() => generateErrorAlert(show, error), [error])
    useEffect(() => {
        function setInitialExpandedCard() {
            if (sortedData) {
                setExpandedCardId(_.head(sortedData)?.trackedEntityInstance)
            }
        }

        setInitialExpandedCard();
    }, [data])
    useEffect(() => {
        function refresh() {
            if (orgUnit && !_.isEmpty(period)) {
                if (!selectedStatus) {
                    refetch({ou: orgUnit?.id, page, pageSize, ouMode: 'DESCENDANTS'})
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
    }, [refetch])

    const onPageChange = useCallback((newPage) => setPage(newPage), []);
    const onPageSizeChange = useCallback((newPageSize) => setPageSize(newPageSize), []);

    const onModalClose = useCallback((onClose) => {
        setSelectedChallenge(undefined);
        onClose();
    }, [])

    const onDownloadExcel = useRecoilCallback(({set}) => () => {
        show({message: i18n.t('Preparing a Excel file'), type: {info: true}});
        set(DownloadType, 'excel')
        set(DownloadActive, true)
    }, [show])

    const onDownloadPDF = useRecoilCallback(({set}) => () => {
        show({message: i18n.t('Preparing a PDF file'), type: {info: true}});
        set(DownloadType, 'pdf')
        set(DownloadActive, true)
    }, [show])

    const onEdit = useCallback((object) => {
        setSelectedChallenge(object);
        setAddIndicatorOpen(true);
    }, [])


    return (orgUnit && period ?
            <div className={classes['challenge-list-container']}>
                {
                    downloadActive && <Download onDownload={onDownload} downloadRef={downloadRef}/>
                }
                <div className={classes['header-container']}>
                    <MainPageHeader
                        listIsEmpty={_.isEmpty(data?.indicators?.trackedEntityInstances)}
                        onDownloadExcel={onDownloadExcel}
                        onDownloadPDF={onDownloadPDF}
                        onAddIndicatorClick={_ => onModalClose(_ => setAddIndicatorOpen(true))}
                    />
                </div>
                {(loading || filteredTeisLoading) &&
                <div className={classes['full-page']}><FullPageLoader/></div>}
                {((!loading || !filteredTeisLoading) && error) &&
                <div className={classes['full-page']}><FullPageError error={error?.message || error?.toString()}/>
                </div>}
                {((!loading || !filteredTeisLoading) && !error && data) && <>
                    {
                        _.isEmpty(sortedData) ?
                            <div className={classes['full-page']}><EmptyChallengeList
                                onAddIndicatorClick={_ => setAddIndicatorOpen(true)}/></div> :
                            <div id='challenge-list'>
                                {
                                    _.map(sortedData, (trackedEntityInstance) => {
                                        const indicator = new Bottleneck(trackedEntityInstance);
                                        return (
                                            <div className={classes['challenge-card']} key={`${indicator.id}-grid`}>
                                                <ChallengeCard expandedCardId={expandedCardId}
                                                               setExpandedCardId={setExpandedCardId} onEdit={onEdit}
                                                               refresh={refetch}
                                                               key={`${indicator.id}-card`} indicator={indicator}/>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                    }
                    {
                        data?.indicators?.pager.pageCount > 1 &&
                        <div className={classes['paginator-container']}>
                            <CenteredContent>
                                <Paginator pager={data.indicators.pager} onPageChange={onPageChange}
                                           onPageSizeChange={onPageSizeChange}/>
                            </CenteredContent>
                        </div>
                    }
                    {
                        addIndicatorOpen &&
                        <ChallengeDialog challenge={selectedChallenge}
                                         onClose={_ => onModalClose(_ => setAddIndicatorOpen(false))}
                                         onUpdate={onAddIndicator}/>

                    }
                </>
                }
            </div> : <NoDimensionsSelectedView/>
    )
}
