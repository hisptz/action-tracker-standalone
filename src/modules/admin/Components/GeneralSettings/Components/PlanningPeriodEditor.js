import CustomPeriodEditor from "./CustomPeriodEditor";
import React, {useState} from 'react';

export default function PlanningPeriodEditor() {
    const [selectedPeriodType, setSelectedPeriodType] = useState();

    const onPeriodSelect = ({selected}) => setSelectedPeriodType(selected);

    return (
        <CustomPeriodEditor onChange={onPeriodSelect} label='Planning Period' value={selectedPeriodType}/>
    )
}
