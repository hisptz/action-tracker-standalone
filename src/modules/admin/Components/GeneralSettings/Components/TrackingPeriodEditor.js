import CustomPeriodEditor from "./CustomPeriodEditor";
import React from "react";


export default function TrackingPeriodEditor(){

    return (
        <CustomPeriodEditor onChange={_=>console.log(_)} label='Tracking Period' />
    )
}
