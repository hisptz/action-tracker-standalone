import React, {useState} from 'react';
import Paper from '@material-ui/core/Paper';
import SelectionWrapper from '../../../shared/Components/SelectionWrapper/SelectionWrapper';
import '../../../core/Components/styles/FilterComponents.css';
import {FilterComponentTypes} from '../../../core/constants';
import PeriodFilter from '../../../shared/Dialogs/PeriodFilter';
import OrganisationUnitFilter from '../../../shared/Dialogs/OrgUnitFilter';
import {useRecoilState, useRecoilValue} from "recoil";
import {DimensionsState} from "../../../core/states";
import {Button} from '@dhis2/ui';
import SettingsIcon from '@material-ui/icons/Settings';
import Visibility from "../../../shared/Components/Visibility";
import {useHistory, useNavigate, useRouteMatch} from "react-router-dom";
import {UserRolesState} from "../../../core/states/user";
import i18n from '@dhis2/d2-i18n'
import classes from '../main.module.css'

export function FilterComponents() {
    const [openPeriodFilter, setOpenPeriodFilter] = useState(false);
    const [openOrgUnitFilter, setOpenOrgUnitFilter] = useState(false);
    const [selectedDimensions, setSelectedDimensions] = useRecoilState(DimensionsState);
    const {settings} = useRecoilValue(UserRolesState);
    const navigate = useNavigate();
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
        <Paper elevation={1} >
            <div className={classes['filter-row']} >
                <div className={classes['filter-selection-container']} >
                    <div className={classes['filter-selection']} >
                        <SelectionWrapper
                            id='orgUnit-selector'
                            onClick={(_) => setOpenOrgUnitFilter(true)}
                            dataObj={selectedDimensions.orgUnit || {}}
                            type={FilterComponentTypes.ORG_UNIT}
                        />
                    </div>
                    <div className={classes['filter-selection']} >
                        <SelectionWrapper
                            id='period-selector'
                            onClick={(_) => setOpenPeriodFilter(true)}
                            type={FilterComponentTypes.PERIOD}
                            periodItems={selectedDimensions.period || []}
                        />
                    </div>
                </div>
                <div className={classes['settings-btn']} >
                    <Visibility visible={Object.values(settings).reduce((pV, v) => pV || v)}>
                        <Button dataTest='settings-button' onClick={() => navigate(`/admin`)}
                                icon={<SettingsIcon/>}>
                            {i18n.t('Settings')}
                        </Button>
                    </Visibility>
                </div>
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
            </div>
        </Paper>
    );
}

export default FilterComponents;
