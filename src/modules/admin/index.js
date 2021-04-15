import {Button} from '@dhis2/ui';
import React from 'react';
import {MemoryRouter, Route, Switch, useHistory} from "react-router-dom";
import {Container} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import BackIcon from '@material-ui/icons/ArrowBack';
import AdminMenu from "./Components/Menu";
import ActionStatusLegendSettingsPage from "./Components/ActionStatusLegend";
import ChallengeMethodsSettingsPage from "./Components/ChallengeMethods";
import PlanningPeriodSettingsPage from "./Components/GeneralSettings";
import _ from 'lodash';
import ActionIcon from '@material-ui/icons/AssignmentTurnedIn';
import SettingsIcon from '@material-ui/icons/Settings';
import MethodsIcon from "@material-ui/icons/AccountTree";


const menu = [
    {
        pathname: '/general-settings',
        component: PlanningPeriodSettingsPage,
        icon: <SettingsIcon/>,
        label: 'General Settings'
    },
    {
        pathname: '/challenge-methods',
        component: ChallengeMethodsSettingsPage,
        icon: <MethodsIcon/>,
        label: 'Challenge Identification Methods'
    },
    {
        pathname: '/action-status-settings',
        component: ActionStatusLegendSettingsPage ,
        icon: <ActionIcon/>,
        label: 'Action Status Settings'
    },
]

export default function AdminPage() {
    const history = useHistory();

    const styles = {
        container: {
            padding: 20,
            overflowX: 'hidden'
        },
    }


    return (
        <Container style={styles.container} maxWidth={false}>
            <MemoryRouter  initialEntries={menu} initialIndex={0} >
                <Grid container spacing={3} direction='column'>
                    <Grid item>
                        <Button onClick={_ => history.goBack()} icon={<BackIcon/>}>Back</Button>
                    </Grid>
                    <Grid item container spacing={3}>
                        <Grid item md={4} lg={3} xs={12}>
                            <AdminMenu menu={menu}/>
                        </Grid>
                        <Grid item md={8} lg={9} xs={12}>
                            <Switch>
                                {
                                    _.map(menu, ({component, pathname}) => <Route component={component} path={pathname} exact/>)
                                }
                            </Switch>
                        </Grid>
                    </Grid>
                </Grid>
            </MemoryRouter>
        </Container>
    )
}
