import {MenuItem} from '@dhis2/ui';
import React from 'react';
import {MemoryRouter, Route, Switch, useHistory} from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import BackIcon from '@material-ui/icons/ArrowBack';
import AdminMenu from "./Components/Menu";
import ActionStatusLegendSettingsPage from "./Components/ActionStatusLegend";
import ChallengeMethodsSettingsPage from "./Components/ChallengeMethods";
import GeneralSettingsPage from "./Components/GeneralSettings";
import _ from 'lodash';


const menu = [
    {
        pathname: '/general-settings',
        component: GeneralSettingsPage,
        label: 'General Settings'
    },
    {
        pathname: '/challenge-methods',
        component: ChallengeMethodsSettingsPage,
        label: 'Challenge Identification Methods'
    },
    {
        pathname: '/action-status-settings',
        component: ActionStatusLegendSettingsPage,
        label: 'Action Status Settings'
    },
]

export default function AdminPage() {
    const history = useHistory();
    const styles = {
        container: {
            width: '100%',
            minWidth: 'calc(1366px - 4px)',
            overflowX: 'auto',
            height: 'calc(100vh - 48px)',
            display: 'flex',
            direction: 'row'
        },
        sideMenu: {
            width: '20%',
            paddingTop: 16,
            borderRight: '1px solid #D5DDE5',
            height: 'calc(100vh - 48px)'
        },
        content: {
            padding: 16,
            width: '80%'
        }
    }

    return (
        <div style={styles.container}>
            <MemoryRouter initialEntries={menu} initialIndex={0}>
                <div style={styles.sideMenu}>
                    <Grid style={{width: '100%'}} container direction='column' spacing={0}>
                        <Grid item style={{padding: '8px 0'}}>
                            <MenuItem onClick={_ => history.goBack()} label='Back to action planning'
                                      icon={<BackIcon/>}/>
                        </Grid>
                        <Grid item style={{padding: '8px 0'}}>
                            <AdminMenu menu={menu}/>
                        </Grid>
                    </Grid>
                </div>
                <div style={styles.content}>
                    <Switch>
                        {
                            _.map(menu, ({component, pathname}) => <Route key={pathname} component={component} path={pathname}
                                                                          exact/>)
                        }
                    </Switch>
                </div>
            </MemoryRouter>
        </div>
    )
}

