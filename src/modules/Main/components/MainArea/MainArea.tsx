import {useDimensions} from "../../../../shared/hooks/dimensions";
import React from "react";
import {DimensionsNotSelected} from "./components/DimensionsNotSelected";

export function MainArea() {
    const {orgUnit, period} = useDimensions();

    if (!orgUnit || !period) {
        return <DimensionsNotSelected/>
    }


    return (
        <div>
            The good stuff
        </div>
    )

}
