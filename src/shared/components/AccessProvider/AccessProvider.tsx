import React from 'react'
import { useAccess } from './hooks/access'

export type AccessType =
    'Standalone Action Tracker - Planning'
    | 'Standalone Action Tracker - Tracking'
    | 'Standalone Action Tracker - Configure'

export interface AccessProviderProps {
    children: React.ReactNode,
    access: AccessType,
    shouldHide?: boolean,
    override?: boolean
}

export function AccessProvider ({
                                    access,
                                    children,
                                    shouldHide,
                                    override
                                }: AccessProviderProps) {
    const allowed = useAccess(access)

    if (!allowed && shouldHide) {
        return null
    }
    return React.cloneElement(children as React.ReactElement, {
        disabled: override || !allowed || undefined,
    })
}
