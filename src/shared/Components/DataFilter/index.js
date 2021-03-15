import { useState} from 'react'
import { Transfer } from '@dhis2/ui';

function DataFilter({options, initiallySelected, getSelected}) {
    const [selected, setSelected] = useState(initiallySelected)
    const onChange = payload => {
      if(payload && payload.selected) {
        setSelected(payload.selected)
        getSelected(payload.selected);
      }
    }



  return (
    <div>
      <Transfer
        filterable
        height="390px"
        maxSelections={1}
        selected={selected}
        onChange={onChange}
        options={options}
      />
    </div>
  );
}

export default DataFilter;
