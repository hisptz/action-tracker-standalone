import {Button as MaterialButton, ButtonGroup, Card, Container, Grid, Typography} from "@material-ui/core";
import React from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {PageState} from "../../../core/states";
import {Button, ButtonStrip} from '@dhis2/ui';
import AddIcon from '@material-ui/icons/Add';
import DownloadIcon from '@material-ui/icons/GetApp';
import ColumnIcon from '@material-ui/icons/ViewColumn';

const PageSelector = () => {
    const [activePage, setDimensions] = useRecoilState(PageState);

    const styles = {
        active: {
            background: '#2B6A5D',
            color: '#fff',
            textTransform: 'none'
        },
        inactive:{
            textTransform: 'none'
        }
    }
    const onClick = (page) => setDimensions(page)

    return (
        <ButtonGroup>
            <MaterialButton onClick={_ => onClick('Planning')}
                    style={activePage === 'Planning' ? styles.active : styles.inactive}>Planning</MaterialButton>
            <MaterialButton style={activePage === 'Tracking' ? styles.active : styles.inactive} onClick={_ => onClick('Tracking')}
            >Tracking</MaterialButton>
        </ButtonGroup>
    )
}

export default function MainPageHeader({onAddIndicatorClick}) {
    const activePage = useRecoilValue(PageState)
    return (
        <Container maxWidth={false} style={{paddingLeft: 0, paddingRight: 0}}>
            <Grid container spacing={4}>
                <Grid item container xs={6} lg={4} spacing={3}>
                    <Grid item><Typography variant='h5' style={{color: '#6E7A8A'}}><b>Action {activePage}</b></Typography></Grid>
                    <Grid item> <PageSelector/></Grid>
                </Grid>
                <Grid container direction='row' justify='space-between' item xs={12}>
                   <Grid item>
                       <Button onClick={onAddIndicatorClick} icon={<AddIcon/>} >Add Indicator</Button>
                   </Grid>
                    <Grid item>
                        <ButtonStrip>
                            <Button icon={<ColumnIcon/>} >Manage Columns</Button>
                            <Button icon={<DownloadIcon/>} >Download</Button>
                        </ButtonStrip>
                    </Grid>

                </Grid>
            </Grid>
        </Container>
    )
}
