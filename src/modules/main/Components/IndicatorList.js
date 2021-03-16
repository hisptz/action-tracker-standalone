import React, {useEffect, useState} from 'react';
import _ from 'lodash';
import {Grid} from "@material-ui/core";
import IndicatorCard from "./IndicatorCard";
import {useRecoilValue} from "recoil";
import {DimensionsState} from "../../../core/states";
import NoDimensionsSelectedView from "./NoDimensionsSelectedView";
import MainPageHeader from "./MainPageHeader";
import EmptyIndicatorList from "./EmptyIndicatorList";
import FullPageLoader from "../../../shared/Components/FullPageLoader";
import {useDataQuery} from "@dhis2/app-runtime";
import Bottleneck from "../../../core/models/bottleneck";
import ChallengeDialog from "../../../shared/Dialogs/ChallengeDialog";

const indicatorQuery = {
    indicators: {
        resource: 'trackedEntityInstances',
        params: ({ou}) => ({
            program: 'Uvz0nfKVMQJ',
            ou,
            fields: [
                'trackedEntityInstance',
                'attributes[attribute,value]',
                'enrollments[events[programStage,event,dataValues[dataElement,value]]]'
            ]
        })
    }
}


export default function IndicatorList() {
    const {orgUnit, period} = useRecoilValue(DimensionsState);

    const {loading, data, error, refetch} = useDataQuery(indicatorQuery, {variables: {ou: orgUnit?.id}});
    const [addIndicatorOpen, setAddIndicatorOpen] = useState(false)

    useEffect(() => {
        function refresh() {
            if (orgUnit && period) refetch({ou: orgUnit?.id})
        }

        refresh();
    }, [orgUnit, period]);

    const onAddIndicator = () =>{refetch()}

    return (orgUnit && period ?
            <>
                {loading && <FullPageLoader/>}
                {(!loading && error) && <p>{error?.message || error.toString()}</p>}
                {(!loading && !error && data) && <>
                    {
                        _.isEmpty(data.indicators?.trackedEntityInstances) ? <EmptyIndicatorList/> :
                            <Grid container spacing={3}>
                                <Grid item xs={12} style={{maxHeight: 120}} container justify='center'>
                                    <MainPageHeader onAddIndicatorClick={_ => setAddIndicatorOpen(true)}/>
                                </Grid>
                                <Grid item xs={12}>
                                    {
                                        _.map(data.indicators?.trackedEntityInstances, (trackedEntityInstance) => {
                                            const indicator = new Bottleneck(trackedEntityInstance);
                                            return (
                                                <IndicatorCard indicator={indicator}/>
                                            )
                                        })
                                    }
                                </Grid>
                                {
                                    addIndicatorOpen && <ChallengeDialog onClose={_ => setAddIndicatorOpen(false)} onUpdate={onAddIndicator}/>

                                }
                            </Grid>
                    }
                </>
                }
            </> : <NoDimensionsSelectedView/>
    )
}
