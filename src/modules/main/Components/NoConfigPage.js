import ErrorIcon from "@material-ui/icons/Error";
import {CenteredContent} from "@dhis2/ui";
import React, {useMemo} from "react";
import {useRecoilValue} from "recoil";
import {UserRolesState} from "../../../core/states/user";
import {Button} from '@dhis2/ui'
import SettingsIcon from "@material-ui/icons/Settings";
import {useHistory, useRouteMatch} from "react-router-dom";
import i18n from '@dhis2/d2-i18n'
import Visibility from "../../../shared/Components/Visibility";

export default function NoConfigPage(){
    const {settings} = useRecoilValue(UserRolesState);
    const history = useHistory();
    const {url} = useRouteMatch();

    const isAdmin = useMemo(() => Object.values(settings).reduce((pV, v) => pV || v), [settings]);

    return (
        <CenteredContent>
            <div style={{textAlign:'center'}}>
                <ErrorIcon fontSize='large' style={{color: '#6E7A8A' }} />
                <h4 style={{color: '#6E7A8A'}}>{i18n.t('Configurations not found.')} {`${isAdmin ? i18n.t('Configure the app to continue.'): i18n.t('Contact the administrator.')}`}</h4>
                <Visibility visible={isAdmin}>
                    <Button dataTest='settings-button' onClick={() => history.push(`${url}admin`)}
                            icon={<SettingsIcon/>}>
                        {i18n.t('Settings')}
                    </Button>
                </Visibility>
            </div>
        </CenteredContent>
    )
}
