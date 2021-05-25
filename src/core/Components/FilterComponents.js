import React, {useState} from 'react';
import Paper from '@material-ui/core/Paper';
import SelectionWrapper from '../../shared/Components/SelectionWrapper/SelectionWrapper';
import './styles/FilterComponents.css';
import {FilterComponentTypes} from '../constants';
import PeriodFilter from '../../shared/Dialogs/PeriodFilter';
import OrganisationUnitFilter from '../../shared/Dialogs/OrgUnitFilter';
import Grid from '@material-ui/core/Grid';
import {useRecoilState, useRecoilValue} from "recoil";
import {DimensionsState} from "../states";
import {Container} from "@material-ui/core";
import {Button} from '@dhis2/ui';
import SettingsIcon from '@material-ui/icons/Settings';
import Visibility from "../../shared/Components/Visibility";
import {useHistory, useRouteMatch} from "react-router-dom";
import {UserRolesState} from "../states/user";


export function FilterComponents() {
    const [openPeriodFilter, setOpenPeriodFilter] = useState(false);
    const [openOrgUnitFilter, setOpenOrgUnitFilter] = useState(false);
    const [selectedDimensions, setSelectedDimensions] = useRecoilState(DimensionsState);
    const {settings} = useRecoilValue(UserRolesState);
    const history = useHistory();
    const {url} = useRouteMatch();
    const onUpdateOrgUnitFilter = (data) => {
        if (data) {
            setSelectedDimensions({...selectedDimensions, orgUnit: data});
        }
        setOpenOrgUnitFilter(false);
    };
    const onUpdatePeriodFilter = (data) => {
        if (!_.isEmpty(data)) {
            setSelectedDimensions({...selectedDimensions, period: data});
        }
        setOpenPeriodFilter(false);
    };

    return (
        <Paper elevation={2} style={{minWidth: 1366}}>
            <Container maxWidth={false} style={{padding: 20}}>
                <Grid container direction='row' justify='space-between'>
                    <Grid item container spacing={5} xs={10}>
                        <Grid item>
                            <SelectionWrapper
                                id='orgUnit-selector'
                                onClick={(_) => setOpenOrgUnitFilter(true)}
                                dataObj={selectedDimensions.orgUnit || {}}
                                type={FilterComponentTypes.ORG_UNIT}
                            />
                        </Grid>
                        <Grid item>
                            <SelectionWrapper
                                id='period-selector'
                                onClick={(_) => setOpenPeriodFilter(true)}
                                type={FilterComponentTypes.PERIOD}
                                periodItems={selectedDimensions.period || []}
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={2} container direction='row' justify='flex-end'>
                        <Visibility visible={Object.values(settings).reduce((pV, v) => pV || v)}>
                            <Button dataTest='settings-button' onClick={() => history.push(`${url}admin`)}
                                    icon={<SettingsIcon/>}>
                                Settings
                            </Button>
                        </Visibility>
                    </Grid>
                </Grid>

                {openPeriodFilter && (
                    <PeriodFilter
                        onClose={(_) => setOpenPeriodFilter(false)}
                        onUpdate={onUpdatePeriodFilter}
                        initialPeriods={selectedDimensions.period}
                    />
                )}
                {openOrgUnitFilter && (
                    <OrganisationUnitFilter
                        onClose={(_) => setOpenOrgUnitFilter(false)}
                        onUpdate={onUpdateOrgUnitFilter}
                        initialOrgUnit={selectedDimensions.orgUnit}
                    />
                )}
            </Container>
        </Paper>
    );
}

export default FilterComponents;
