import { useDimensions } from '../../../../shared/hooks'
import React from 'react'
import { DimensionsNotSelected } from './components/DimensionsNotSelected'
import { DataArea } from './components/DataArea'
import { AddButton } from './components/AddButton'
import { ManageColumns } from './components/ManageColumns'
import { Download } from './components/Download'

export function MainArea() {
    const {orgUnit, period} = useDimensions();

    console.log(orgUnit, "mainArea")

    if ((orgUnit === undefined) || (period === undefined)) {
        return <DimensionsNotSelected/>
    }

    return (
        <div className="column p-16 gap-16 h-100">
            <div className="row space-between">
                <div>
                    <AddButton/>
                </div>
                <div className="row gap-16">
                    <ManageColumns/>
                    <Download/>
                </div>
            </div>
            <div style={{flexGrow: 1, height: "100%"}}>
                <DataArea/>
            </div>
        </div>
    )
}
