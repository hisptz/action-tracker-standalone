import { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import SelectionWrapper from '../../shared/Components/SelectionWrapper/SelectionWrapper';
import './styles/FilterComponents.css';
import { FilterComponentTypes } from '../constants/constants';
import PeriodFilter from '../../shared/Dialogs/PeriodFilter';
import OrganisationUnitFilter from '../../shared/Dialogs/OrgUnitFilter';
import Grid from '@material-ui/core/Grid';

export function FilterComponents() {
  const [openPeriodFilter, setOpenPeriodFilter] = useState(false);
  const [openOrgUnitFilter, setOrgUnitFilter] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedPeriodItems, setSelectedPeriodItems] = useState([]);
  const onUpdateOrgUnitFilter = (data) => {
    if (data) {
      setSelectedData(data);
    }
    setOrgUnitFilter(false);
  };

  const onClose = () => {
    setOrgUnitFilter(false);
  };

  const onUpdatePeriodFilter = (data) => {
    if (data && data.length) {
      const items = data[0] && data[0].items ? data[0].items : [];
      setSelectedPeriodItems(items);
    }
    setOpenPeriodFilter(false);
  };

  return (
    <Paper className="components-container" elevation={2}>
      <Grid className="filters-grid" container spacing={5}>
        <Grid item>
          <SelectionWrapper
            onClick={(_) => setOrgUnitFilter(true)}
            dataObj={selectedData}
            type={FilterComponentTypes.ORG_UNIT}
          />
        </Grid>
        <Grid item>
          <SelectionWrapper
            onClick={(_) => setOpenPeriodFilter(true)}
            type={FilterComponentTypes.PERIOD}
            periodItems={selectedPeriodItems}
          />
        </Grid>
      </Grid>

      {openPeriodFilter && (
        <PeriodFilter
          onClose={(_) => setOpenPeriodFilter(false)}
          onUpdate={onUpdatePeriodFilter}
        />
      )}
      {openOrgUnitFilter && (
        <OrganisationUnitFilter
          onClose={(_) => setOrgUnitFilter(false)}
          onUpdate={onUpdateOrgUnitFilter}
        />
      )}
     
    </Paper>
  );
}

export default FilterComponents;
