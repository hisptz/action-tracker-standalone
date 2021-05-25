import ErrorIcon from "@material-ui/icons/Error";
import {CenteredContent} from "@dhis2/ui";
import React from "react";
import {useRecoilValue} from "recoil";
import {UserRolesState} from "../../../core/states/user";
import {Button} from '@dhis2/ui'
import SettingsIcon from "@material-ui/icons/Settings";
import {useHistory, useRouteMatch} from "react-router-dom";


export default function NoConfigPage(){
    const {settings} = useRecoilValue(UserRolesState);
    const history = useHistory();
    const {url} = useRouteMatch();

    return (
        <CenteredContent>
            <div style={{textAlign:'center'}}>
                <ErrorIcon fontSize='large' style={{color: '#6E7A8A' }} />
                <h4 style={{color: '#6E7A8A'}}>Configurations not found. {`${Object.values(settings).reduce((pV, v)=> pV || v) ? 'Configure the app to continue.': 'Contact the administrator.'}`}</h4>
                <Button dataTest='settings-button' onClick={() => history.push(`${url}admin`)}
                        icon={<SettingsIcon/>}>
                    Settings
                </Button>
            </div>
        </CenteredContent>
    )
}
