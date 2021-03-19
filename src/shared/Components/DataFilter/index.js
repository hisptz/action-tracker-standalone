import {useState} from 'react'
import {Transfer, CenteredContent} from '@dhis2/ui';
import useIndicatorsSelected from '../../../core/hooks/indicatorsSelected';
import {useRecoilValue} from 'recoil';
import { IndicatorsSelectedState} from '../../../core/states'
import { formatDataFilterOptions} from '../../../core/helpers/dataManipulationHelper';

function DataFilter({options, initiallySelected, getSelected, loading, error}) {
    const indicatorSelectedStatus = useIndicatorsSelected();
    const indicatorsSelected = useRecoilValue(IndicatorsSelectedState);
  
    const [selected, setSelected] = useState(initiallySelected)
    const formattedOptionsList = formatDataFilterOptions(options,indicatorsSelected );
    const onChange = payload => {
        if (payload && payload.selected) {
            setSelected(payload.selected)
            getSelected(payload.selected);
        }
    }
    

    return (
        <CenteredContent>
            <Transfer
                filterable
                height="250px"
                maxSelections={1}
                selected={selected || []}
                onChange={onChange}
                options={formattedOptionsList || []}
                loading={loading || indicatorSelectedStatus.loading}
            />
        </CenteredContent>
    );
}

export default DataFilter;
