import React, {useMemo, useState} from 'react'
import {CenteredContent, Transfer} from '@dhis2/ui';
import useIndicatorsSelected from '../../../core/hooks/indicatorsSelected';
import {useRecoilState, useRecoilValue} from 'recoil';
import {IndicatorsSelectedState} from '../../../core/states'
import {formatDataFilterOptions} from '../../../core/helpers/dataManipulation.helper';
import {IndicatorSearchState} from "../../../core/states/indicators-selector";
import useIndicators from "../../../core/hooks/indicators";

function DataFilter({initiallySelected, getSelected}) {
    const indicatorSelectedStatus = useIndicatorsSelected();
    const indicatorsSelected = useRecoilValue(IndicatorsSelectedState);
    const [selected, setSelected] = useState([initiallySelected]);
    const [searchKeyword, setSearchKeyword] = useRecoilState(IndicatorSearchState);
    const {loading, error, nextPage, search, indicators} = useIndicators()
    const formattedOptionsList = useMemo(
        () => formatDataFilterOptions(
            indicators?.map(({
                                 displayName,
                                 id
                             }) => ({
                label: displayName,
                value: id
            })), indicatorsSelected), [indicatorsSelected, indicators]);

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
        console.log('Next page')
        nextPage()
    }

    const onSearch = ({value}) => {
        search(value)
    }

    return (
        <CenteredContent>
            <Transfer
                onFilterChange={onSearch}
                searchTerm={searchKeyword}
                filterable
                height="400px"
                width="100%"
                maxSelections={1}
                selected={selected || []}
                onChange={onChange}
                onEndReached={onEndReached}
                options={formattedOptionsList || []}
                loading={loading || indicatorSelectedStatus.loading}
            />
            {
                error &&
                <CenteredContent><p style={{
                    fontSize: 12,
                    color: 'red'
                }}>{error?.message || error.toString()}</p>
                </CenteredContent>
            }
        </CenteredContent>
    );
}

export default DataFilter;
