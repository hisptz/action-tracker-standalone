import {useState} from 'react'
import {Transfer, CenteredContent} from '@dhis2/ui';
import useIndicatorsSelected from '../../../core/hooks/indicatorsSelected';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import { IndicatorsSelectedState,IndicatorPaginationState} from '../../../core/states'
import { formatDataFilterOptions} from '../../../core/helpers/dataManipulation.helper';

function DataFilter({options, initiallySelected, getSelected, loading}) {
    const indicatorSelectedStatus = useIndicatorsSelected();
    const indicatorsSelected = useRecoilValue(IndicatorsSelectedState);
    const [selected, setSelected] = useState([initiallySelected]);
    const [indicatorPage,setIndicatorPage] = useRecoilState(IndicatorPaginationState);
    const formattedOptionsList = formatDataFilterOptions(options,indicatorsSelected);
    const [page, setPage] = useState(0)
    const onChange = ({selected}) => {
        if (selected) {
            setSelected(selected)
            getSelected(_.head(selected));
        }


    }
    const onEndReached = () => {
        if (loading) {
            return
        }
        setIndicatorPage(indicatorPage + 1)
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
                onEndReached={onEndReached}
                options={formattedOptionsList || []}
                loading={loading || indicatorSelectedStatus.loading}
            />
        </CenteredContent>
    );
}

export default DataFilter;
