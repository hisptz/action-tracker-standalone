import { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import SelectionWrapper from '../../shared/Components/SelectionWrapper/SelectionWrapper';
import './styles/FilterComponents.css';
import { FilterComponentTypes } from '../constants/Constants';
import PeriodFilter from '../../shared/Components/PeriodFilter';
import OrganisationUnitFilter from '../../shared/Components/OrgUnitFilter';
import Grid from '@material-ui/core/Grid';

export function FilterComponents() {
  const [openPeriodFilter, setOpenPeriodFilter] = useState(false);
  const [openOrgUnitFilter, setOrgUnitFilter] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const onUpdate = (data) => {
    if (data) {
      setSelectedData(data);
    }
    setOrgUnitFilter(false);
  };

  return (
    <Paper className="components-container" elevation={2}>
      <Grid container  spacing={5}>
        <Grid item >
          <SelectionWrapper
            onClick={(_) => setOrgUnitFilter(true)}
            dataObj={selectedData}
            type={FilterComponentTypes.ORG_UNIT}
          />
        </Grid>
        <Grid item >
          <SelectionWrapper
            onClick={(_) => setOpenPeriodFilter(true)}
            type={FilterComponentTypes.PERIOD}
          />
        </Grid>
      </Grid>

      {openPeriodFilter && (
        <PeriodFilter
          onClose={(_) => setOpenPeriodFilter(false)}
          onUpdate={onUpdate}
        />
      )}
      {openOrgUnitFilter && (
        <OrganisationUnitFilter
          onClose={(_) => setOrgUnitFilter(false)}
          onUpdate={onUpdate}
        />
      )}
    </Paper>
  );
}

export default FilterComponents;
