import React, {useEffect, useState} from 'react';
import _ from 'lodash';
import {Grid} from "@material-ui/core";
import ChallengeCard from "./ChallengeCard";
import {useRecoilValue} from "recoil";
import {DimensionsState} from "../../../core/states";
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

const indicatorQuery = {
    indicators: {
        resource: 'trackedEntityInstances',
        params: ({ou, page, pageSize}) => ({
            program: 'Uvz0nfKVMQJ',
            page,
            pageSize,
            totalPages: true,
            ou,
            fields: [
                'trackedEntityInstance',
                'attributes[attribute,value]',
                'enrollments[events[programStage,event,dataValues[dataElement,value]]]'
            ]
        })
    }
}

export default function ChallengeList() {
    const {orgUnit, period} = useRecoilValue(DimensionsState);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const {loading, data, error, refetch} = useDataQuery(indicatorQuery, {
        variables: {ou: orgUnit?.id, page, pageSize},
        lazy: true
    });
    const [addIndicatorOpen, setAddIndicatorOpen] = useState(false)
    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}))
    useEffect(() => generateErrorAlert(show, error), [error])

    useEffect(() => {
        function refresh() {
            if (orgUnit && period) refetch({ou: orgUnit?.id, page, pageSize})
        }

        refresh();
    }, [orgUnit, period, page, pageSize]);

    const onAddIndicator = () => {
        refetch()
    }

    const onPageChange = (newPage) => setPage(newPage);
    const onPageSizeChange = (newPageSize) => setPageSize(newPageSize);

    const [selectedChallenge, setSelectedChallenge] = useState(undefined);


    const onModalClose = (onClose) => {
        setSelectedChallenge(undefined);
        onClose();
    }

    const onEdit = (object) => {
        setSelectedChallenge(object);
        setAddIndicatorOpen(true);
    }

    return (orgUnit && period ?
            <>
                {loading && <FullPageLoader/>}
                {(!loading && error) && <p>{error?.message || error.toString()}</p>}
                {(!loading && !error && data) && <>
                    {
                        _.isEmpty(data.indicators?.trackedEntityInstances) ?
                            <EmptyChallengeList onAddIndicatorClick={_ => setAddIndicatorOpen(true)}/> :
                            <Grid container spacing={3}>
                                <Grid item xs={12} style={{maxHeight: 120, margin: 0}} container justify='center'>
                                    <MainPageHeader onAddIndicatorClick={_=>onModalClose(_ => setAddIndicatorOpen(true))}/>
                                </Grid>
                                <Grid item xs={12} container spacing={3} style={{margin: 0}}>
                                    {
                                        _.map(data.indicators?.trackedEntityInstances, (trackedEntityInstance) => {
                                            const indicator = new Bottleneck(trackedEntityInstance);
                                            return (
                                                <ChallengeCard onEdit={onEdit} refresh={refetch}
                                                               key={`${indicator.id}-card`} indicator={indicator}/>
                                            )
                                        })
                                    }
                                </Grid>
                                <Grid item xs={12}>
                                    <CenteredContent>
                                        <Paginator pager={data.indicators.pager} onPageChange={onPageChange}
                                                   onPageSizeChange={onPageSizeChange}/>
                                    </CenteredContent>
                                </Grid>

                            </Grid>
                    }
                    {
                        addIndicatorOpen &&
                        <ChallengeDialog challenge={selectedChallenge} onClose={_=>onModalClose(_ => setAddIndicatorOpen(false))}
                                         onUpdate={onAddIndicator}/>

                    }
                </>
                }
            </> : <NoDimensionsSelectedView/>
    )
}
