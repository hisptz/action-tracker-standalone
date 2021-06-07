import ErrorIcon from "@material-ui/icons/Error";
import {Button, CenteredContent} from "@dhis2/ui";
import React, {useMemo} from "react";
import {useRecoilValue} from "recoil";
import {UserRolesState} from "../../../core/states/user";
import SettingsIcon from "@material-ui/icons/Settings";
import {useHistory, useRouteMatch} from "react-router-dom";
import i18n from '@dhis2/d2-i18n'
import Visibility from "../../../shared/Components/Visibility";
import {useConfig} from "@dhis2/app-runtime";

export default function NoConfigPage() {
    const {settings} = useRecoilValue(UserRolesState);
    const {baseUrl} = useConfig()
    const history = useHistory();
    const {url} = useRouteMatch();
    const isAdmin = useMemo(() => Object.values(settings).reduce((pV, v) => pV || v), [settings]);

    return (
        <CenteredContent>
            <div style={{textAlign: 'center'}}>
                <ErrorIcon fontSize='large' style={{color: '#6E7A8A'}}/>
                <h4 style={{color: '#6E7A8A'}}>{i18n.t('Configurations not found.')} {`${isAdmin ? i18n.t('Configure the app to continue.') : i18n.t('Contact the administrator.')}`}</h4>
                {!isAdmin && <p style={{
                    color: '#6E7A8A',
                    fontSize: 14
                }}>{i18n.t('If you are the admin, configure the appropriate in app authorities in ')}<a
                    href={`${baseUrl}/dhis-web-user/index.action`}>{i18n.t('user settings')}</a></p>}
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
