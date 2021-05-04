import {
    Button as MaterialButton,
    ButtonGroup,
    Container,
    Grid,
    Typography,
} from '@material-ui/core';
import {useRecoilState, useRecoilValue} from 'recoil';
import {
    ActionStatusState,
    DimensionsState,
    PageState,
    StatusFilterState,
} from '../../../core/states';
import {
    Button,
    ButtonStrip,
    SingleSelect,
    SingleSelectOption,
} from '@dhis2/ui';
import React, {useState} from "react";
import AddIcon from '@material-ui/icons/Add';
import DownloadIcon from '@material-ui/icons/GetApp';
import ColumnIcon from '@material-ui/icons/ViewColumn';
import {useAlert} from '@dhis2/app-runtime';
import {Period} from '@iapps/period-utilities';
import DownloadOptionsMenu from "./DownloadOptionsMenu";
import {UserRolesState} from "../../../core/states/user";
import Visibility from "../../../shared/Components/Visibility";
import ColumnManagerDialog from "../../../shared/Dialogs/ColumnManagerDialog";
import {useDataStore} from "@dhis2/app-service-datastore";
import DataStoreConstants from "../../../core/constants/datastore";

const PageSelector = () => {
    const [activePage, setActivePage] = useRecoilState(PageState);
    const {period} = useRecoilValue(DimensionsState);
    const {globalSettings} = useDataStore();
    const trackingPeriod = globalSettings.settings[DataStoreConstants.TRACKING_PERIOD_KEY];

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
            if (period.type === trackingPeriod || _.has(period, trackingPeriod.toLowerCase())) {
                setActivePage(page);
            } else {
                show({message: 'The selected period has no quarters'});
            }
        } else {
            setActivePage(page);
        }
    }
    return (
        <ButtonGroup>
            <MaterialButton
                onClick={(_) => onClick('Planning')}
                style={activePage === 'Planning' ? styles.active : styles.inactive}
            >
                Planning
            </MaterialButton>
            <MaterialButton
                style={activePage === 'Tracking' ? styles.active : styles.inactive}
                onClick={(_) => onClick('Tracking')}
            >
                Tracking
            </MaterialButton>
        </ButtonGroup>
    );
}

export default function MainPageHeader({onAddIndicatorClick, onDownloadPDF, onDownloadExcel, listIsEmpty}) {
    const activePage = useRecoilValue(PageState);
    const actionStatus = useRecoilValue(ActionStatusState);
    const [statusFilter, setStatusFilter] = useRecoilState(StatusFilterState);
    const {bottleneck} = useRecoilValue(UserRolesState);
    const [manageColumnOpen, setManageColumnOpen] = useState(false);
    const [reference, setReference] = useState(undefined);

    return (
        <Container style={{minWidth: 1366}} maxWidth={false} className="main-page-header">
            <Grid container spacing={4}>
                <Grid item container xs={6} lg={6} spacing={3}>
                    <Grid item><Typography variant='h5'
                                           style={{color: '#6E7A8A'}}><b>Action {activePage}</b></Typography></Grid>
                    <Grid item> <PageSelector/></Grid>
                </Grid>
                <Grid container direction='row' justify='space-between' alignItems='center' item xs={12}>
                    <Grid item container spacing={2} xs={6}>
                        <Grid item>
                            <Visibility visible={bottleneck?.create}>
                                <Button onClick={onAddIndicatorClick} icon={<AddIcon/>}>Add Intervention</Button>
                            </Visibility>
                        </Grid>
                        <Grid item xs={6}>
                            <SingleSelect disabled={listIsEmpty} clearText='Clear' clearable selected={statusFilter?.selected}
                                          placeholder='Filter by status' onChange={setStatusFilter}>
                                {
                                    _.map(actionStatus, status => (
                                        <SingleSelectOption key={`${status.code}-status`} value={status.code}
                                                            label={status.name}/>))
                                }
                            </SingleSelect>
                        </Grid>
                    </Grid>
                    <Grid item xs={6} container justify='flex-end'>
                        <ButtonStrip>
                            <Button disabled={listIsEmpty} icon={<ColumnIcon/>} onClick={_ => setManageColumnOpen(true)}>Manage
                                Columns</Button>
                            <Button disabled={listIsEmpty} onClick={(d, e) => setReference(e.currentTarget)} icon={<DownloadIcon/>}>
                                Download
                            </Button>
                        </ButtonStrip>
                        {
                            reference &&
                            <DownloadOptionsMenu onDownloadExcel={onDownloadExcel} onDownloadPDF={onDownloadPDF}
                                                 reference={reference}
                                                 onClose={_ => setReference(undefined)}/>
                        }
                    </Grid>
                    {
                        manageColumnOpen &&
                        <ColumnManagerDialog onClose={_ => setManageColumnOpen(false)} onUpdate={_ => {
                        }}/>
                    }
                </Grid>
            </Grid>
        </Container>
    );
}
