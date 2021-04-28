import {useState} from 'react'
import {Transfer, CenteredContent} from '@dhis2/ui';
import useIndicatorsSelected from '../../../core/hooks/indicatorsSelected';
import {useRecoilValue} from 'recoil';
import { IndicatorsSelectedState} from '../../../core/states'
import { formatDataFilterOptions} from '../../../core/helpers/dataManipulationHelper';

function DataFilter({options, initiallySelected, getSelected, loading}) {
    const indicatorSelectedStatus = useIndicatorsSelected();
    const indicatorsSelected = useRecoilValue(IndicatorsSelectedState);
    const [selected, setSelected] = useState([initiallySelected])
    const formattedOptionsList = formatDataFilterOptions(options,indicatorsSelected);
    const onChange = ({selected}) => {
        if (selected) {
            setSelected(selected)
            getSelected(_.head(selected));
        }
    }

    return (
        <CenteredContent>
            <Transfer
                filterable
                height="100%"
                width="100%"
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
