import React, { useEffect } from 'react'
import { DimensionFilterArea } from './components/DimensionFilterArea'
import { Header } from './components/Header/Header'
import { MainArea } from './components/MainArea'
import { useConfiguration } from '../../shared/hooks/config'
import { useSearchParams } from 'react-router-dom'

export function MainConfigLoader ({ children }: { children: React.ReactNode | React.ReactNode[] | null | undefined }) {
    const [, setParams] = useSearchParams()
    const { config } = useConfiguration()

    useEffect(() => {
        if (config) {
            const defaultPeriod = config.general.period.defaultPeriod
            const defaultOrgUnit = config.general.orgUnit.defaultOrgUnit
            if (defaultOrgUnit !== undefined || defaultPeriod !== undefined) {
                setParams((prev) => {
                    const updatedParams = new URLSearchParams(prev)
                    if (defaultPeriod) {
                        updatedParams.set('pe', defaultPeriod)
                    }
                    if (defaultOrgUnit) {
                        updatedParams.set('ou', defaultOrgUnit)
                    }
                    return updatedParams
                })
            }
        }
    }, [config])

    return <>
        {children}
    </>
}

export function Main () {
    return (
        <MainConfigLoader>
            <div className="column w-100 h-100 gap-16">
                <DimensionFilterArea/>
                <div className="ph-16">
                    <Header/>
                </div>
                <div style={{ flexGrow: 1 }}>
                    <MainArea/>
                </div>
            </div>
        </MainConfigLoader>
    )
}
