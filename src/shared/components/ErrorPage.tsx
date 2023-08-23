import { Button, ButtonStrip, colors, IconError24 } from '@dhis2/ui'
import React, { useState } from 'react'
import { useRouteError } from 'react-router-dom'
import i18n from '@dhis2/d2-i18n'

export default function ErrorPage ({
                                       error: errorFromBoundary,
                                       resetErrorBoundary
                                   }: { error?: Error, resetErrorBoundary?: () => void }) {
    const error = errorFromBoundary ?? useRouteError() as Error
    const [showStack, setShowStack] = useState(false)
    return (
        <div style={{ minHeight: 400 }} className="h-100 w-100 column center align-center">
            <div className="size-48">
                <IconError24 color={colors.grey800}/>
            </div>
            <h3 style={{ color: colors.grey800 }}>{i18n.t('Something went wrong')}</h3>
            <p>{error.message}</p>
            {
                showStack && (
                    <div style={{
                        width: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        background: colors.grey200,
                        maxWidth: 800,
                        padding: 16,
                        margin: 8,
                        border: `1px solid ${colors.grey400}`
                    }}>
                        <code style={{ color: colors.red500 }}>
                            {error.stack}
                        </code>
                    </div>
                )
            }
            <ButtonStrip>
                <Button onClick={() => {
                    if (resetErrorBoundary) {
                        resetErrorBoundary()
                        return
                    }
                    window.location.reload()
                }}>{i18n.t('Reload')}</Button>
                <Button
                    onClick={() => setShowStack(prevState => !prevState)}>{showStack ? `Hide` : 'Show'} details</Button>
            </ButtonStrip>
        </div>
    )
}
