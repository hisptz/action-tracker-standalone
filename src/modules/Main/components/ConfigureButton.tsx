import { Button, IconSettings24 } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AccessProvider } from '../../../shared/components/AccessProvider'

export function ConfigureButton () {
    const navigate = useNavigate()
    const onSettingsClick = () => {
        navigate('config/general')
    }

    return (
        <AccessProvider access="Standalone Action Tracker - Configure">
            <Button icon={<IconSettings24/>} onClick={onSettingsClick}>
                {i18n.t('Configure')}
            </Button>
        </AccessProvider>
    )
}
