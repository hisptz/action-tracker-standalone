import React, { createContext, useCallback, useContext, useState } from 'react'
import { useBoolean } from 'usehooks-ts'
import { ViewModal } from './ViewModal'
import { Event, TrackedEntity } from '../../types/dhis2'
import { ActionConfig, ActionStatusConfig, CategoryConfig } from '../../schemas/config'

export interface ViewModalContextConfig {
    instance: TrackedEntity | Event,
    instanceConfig: CategoryConfig | ActionConfig | ActionStatusConfig,
    content?: React.ReactNode
}

export interface ViewModalContextType {
    show: (config: ViewModalContextConfig) => void;
    hide: () => void;
}

const ViewModalContext = createContext<ViewModalContextType>({
    show: () => {
    },
    hide: () => {
    }
})

export function useViewModal () {
    return useContext(ViewModalContext)
}

export function ViewModalProvider ({ children }: { children: React.ReactNode }) {
    const {
        value: hide,
        setTrue: onHide,
        setFalse: onShow
    } = useBoolean(false)
    const [config, setConfig] = useState<ViewModalContextConfig | null>(null)

    const show = useCallback((config: ViewModalContextConfig) => {
        setConfig(config)
        onShow()
    }, [])

    const hideModal = useCallback(() => {
        setConfig(null)
        onHide()
    }, [onHide])

    return (
        <ViewModalContext.Provider value={{
            show,
            hide: hideModal
        }}>
            {children}
            {
                config && (<ViewModal hide={hide} onClose={hideModal} {...config}  />
                )
            }
        </ViewModalContext.Provider>
    )

}
