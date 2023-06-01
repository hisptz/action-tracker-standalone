import {Button as MaterialButton, ButtonGroup,} from '@material-ui/core';
import {useRecoilState, useRecoilValue} from 'recoil';
import {ActionStatusState, DimensionsState, PageState, StatusFilterState,} from '../../../core/states';
import {Button, ButtonStrip, SingleSelect, SingleSelectOption,} from '@dhis2/ui';
import React, {useState} from "react";
import AddIcon from '@material-ui/icons/Add';
import DownloadIcon from '@material-ui/icons/GetApp';
import ColumnIcon from '@material-ui/icons/ViewColumn';
import {useAlert} from '@dhis2/app-runtime';
import DownloadOptionsMenu from "./DownloadOptionsMenu";
import {UserRolesState} from "../../../core/states/user";
import Visibility from "../../../shared/Components/Visibility";
import ColumnManagerDialog from "../../../shared/Dialogs/ColumnManagerDialog";
import {useSetting} from "@dhis2/app-service-datastore";
import DataStoreConstants from "../../../core/constants/datastore";
import i18n from '@dhis2/d2-i18n'
import classes from '../main.module.css'
import {PeriodTypeCategory, PeriodUtility} from "@hisptz/dhis2-utils";

const PageSelector = () => {
    const [activePage, setActivePage] = useRecoilState(PageState);
    const {period} = useRecoilValue(DimensionsState);
    const [trackingPeriod] = useSetting(DataStoreConstants.TRACKING_PERIOD_KEY, {global: true})

    const {show} = useAlert(
        ({message}) => message,
        ({type}) => ({duration: 3000, ...type})
    );
    const styles = {
        active: {
            background: '#2B6A5D',
            color: '#fff',
            textTransform: 'none',
        },
        inactive: {
            textTransform: 'none',
        },
    };
    const onClick = (page) => {
        if (page === 'Tracking') {
            const periodUtility = new PeriodUtility().setCategory(PeriodTypeCategory.FIXED);
            const periodType = periodUtility.getPeriodType(trackingPeriod.toUpperCase());
            if (period.type?.id === trackingPeriod || period.type.rank >= periodType.config.rank) {
                setActivePage(page);
            } else {
                show({message: i18n.t('The selected period has no quarters')});
            }
        } else {
            setActivePage(page);
        }
    }
    return (
        <ButtonGroup>
            <MaterialButton
                id='planning-button'
                onClick={(_) => onClick('Planning')}
                style={activePage === 'Planning' ? styles.active : styles.inactive}
            >
                {
                    i18n.t('Planning')
                }
            </MaterialButton>
            <MaterialButton
                id='tracking-button'
                style={activePage === 'Tracking' ? styles.active : styles.inactive}
                onClick={(_) => onClick('Tracking')}
            >
                {
                    i18n.t('Tracking')
                }
            </MaterialButton>
        </ButtonGroup>
    );
}

function getTranslation(activePage) {
    return activePage === 'Tracking' ? i18n.t('Tracking') : i18n.t('Planning')
}

export default function MainPageHeader({onAddIndicatorClick, onDownloadPDF, onDownloadExcel, listIsEmpty}) {
    const activePage = useRecoilValue(PageState);
    const actionStatus = useRecoilValue(ActionStatusState);
    const [statusFilter, setStatusFilter] = useRecoilState(StatusFilterState);
    const {bottleneck} = useRecoilValue(UserRolesState);
    const [manageColumnOpen, setManageColumnOpen] = useState(false);
    const [reference, setReference] = useState(undefined);

    return (
        <div className={classes['main-header']}>
            <div className={classes['page-selector-container']}>
                <div className={classes['page-selector-item']}><h2 style={{color: '#6E7A8A'}}>
                    <b>{i18n.t('Action {{ activePage }}', {activePage: getTranslation(activePage)})}</b></h2></div>
                <div><PageSelector/></div>
            </div>
            <div className={classes['main-settings-container']}>
                <div className={classes['challenge-settings']}>
                    <Visibility visible={bottleneck?.create}>
                        <div className={classes['main-settings']}>

                            <Button dataTest='add-intervention-button' onClick={onAddIndicatorClick}
                                    icon={<AddIcon/>}>{i18n.t('Add result area')}</Button>

                        </div>
                    </Visibility>
                    <div className={classes['main-settings']}>
                        <SingleSelect className={classes['status-selector']} disabled={listIsEmpty}
                                      clearText={i18n.t('Clear')} clearable
                                      selected={statusFilter?.selected}
                                      placeholder={i18n.t('Filter by status')} onChange={setStatusFilter}>
                            {
                                _.map(actionStatus, status => (
                                    <SingleSelectOption key={`${status.code}-status`} value={status.code}
                                                        label={i18n.t('{{name}}', {name: status.name})}/>))
                            }
                        </SingleSelect>
                    </div>
                </div>
                <div>
                    <div>
                        <ButtonStrip>
                            <Button disabled={listIsEmpty} icon={<ColumnIcon/>}
                                    onClick={_ => setManageColumnOpen(true)}>{i18n.t('Manage Columns')}</Button>
                            <Button disabled={listIsEmpty} onClick={(d, e) => setReference(e.currentTarget)}
                                    icon={<DownloadIcon/>}>
                                {i18n.t('Download')}
                            </Button>
                        </ButtonStrip>
                    </div>
                </div>
            </div>

            {
                reference &&
                <DownloadOptionsMenu onDownloadExcel={onDownloadExcel} onDownloadPDF={onDownloadPDF}
                                     reference={reference}
                                     onClose={_ => setReference(undefined)}/>
            }
            {
                manageColumnOpen &&
                <ColumnManagerDialog onClose={_ => setManageColumnOpen(false)} onUpdate={_ => {
                }}/>
            }
        </div>
    );
}
