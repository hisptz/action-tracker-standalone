import React, { useEffect, useState } from 'react'
import i18n from '@dhis2/d2-i18n'
import { useSetupMetadata } from './hooks/metadata'
import { useNavigate } from 'react-router-dom'
import appLogo from '../../shared/assets/images/app-logo.png'
import { Button, ButtonStrip, CircularLoader } from '@dhis2/ui'

export function Welcome () {
    const [error, setError] = useState<any>(null)
    const navigate = useNavigate()
    const { setupConfiguration } = useSetupMetadata()

    useEffect(() => {
        async function config () {
            try {
                const response = await setupConfiguration() as any
                if (!response) {
                    //No default programs
                    navigate('/getting-started')
                }
                if (response?.httpStatusCode === 201) {
                    navigate('/')
                }
            } catch (e: any) {
                setError(e)
            }
        }

        config()

    }, [])

    return (
        <div className="w-100 h-100 column center align-center">
            <img alt={i18n.t('app logo')} width={150} src={appLogo}/>
            <h1>{i18n.t('Welcome to the standalone action tracker')}</h1>
            {
                error ? (<div className="column gap-8 align-center">
                    <span>{i18n.t('There were issues with setting up configuration.')}</span>
                    <code>
                        {error.message ?? error.toString()}
                    </code>
                    <ButtonStrip>
                        <Button onClick={() => navigate('/')}>
                            {i18n.t('Retry')}
                        </Button>
                    </ButtonStrip>
                </div>) : (<div className="column gap-8 align-center">
                    <CircularLoader small/>
                    <span>{i18n.t('Setting up configuration')}</span>
                </div>)
            }
        </div>
    )
}
