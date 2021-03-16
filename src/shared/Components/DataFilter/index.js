import {useState} from 'react'
import {Transfer, CenteredContent} from '@dhis2/ui';

function DataFilter({options, initiallySelected, getSelected, loading, error}) {
    const [selected, setSelected] = useState(initiallySelected)
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
                options={options || []}
                loading={loading}
            />
        </CenteredContent>
    );
}

export default DataFilter;
