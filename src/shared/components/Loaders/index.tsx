import React from 'react'
import {CenteredContent, CircularLoader} from '@dhis2/ui'

export function FullPageLoader({
                                   minHeight,
                                   message
                               }: {
    minHeight?: number | string
    message?: string
}): React.ReactElement {
    return (
        <div style={{minHeight}} className="column w-100 h-100 align-center center ">
            <CircularLoader small/>
            {(message != null) && <p>{message}</p>}
        </div>
    )
}

export function CardLoader() {
    return (
        <CenteredContent>
            <CircularLoader small/>
        </CenteredContent>
    )
}
