import React from 'react'
import { colors } from '@dhis2/ui'

export function ColorView ({ color }: { color: string }) {

    return (
        <div style={{
            width: 24,
            height: 24,
            background: color,
            border: `1px solid ${colors.grey400}`,
            borderRadius: 4
        }}/>
    )
}
