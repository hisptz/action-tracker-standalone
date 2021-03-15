import { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import SelectionWrapper from '../../shared/Components/SelectionWrapper/SelectionWrapper';
import './styles/FilterComponents.css';
import { FilterComponentTypes } from '../constants/constants';
import PeriodFilter from '../../shared/Dialogs/PeriodFilter';
import OrganisationUnitFilter from '../../shared/Dialogs/OrgUnitFilter';
import Grid from '@material-ui/core/Grid';
import {useRecoilState} from "recoil";
import {DimensionsState} from "../states";
import {Container} from "@material-ui/core";

export function FilterComponents() {
  const [openPeriodFilter, setOpenPeriodFilter] = useState(false);
  const [openOrgUnitFilter, setOpenOrgUnitFilter] = useState(false);
  const [selectedDimensions, setSelectedDimensions] = useRecoilState(DimensionsState);
  const onUpdateOrgUnitFilter = (data) => {
    if (data) {
      setSelectedDimensions({...selectedDimensions, orgUnit: data});
    }
    setOpenOrgUnitFilter(false);
  };
  const onUpdatePeriodFilter = (data) => {
    if (data && data.length) {
      const items = data[0] && data[0].items ? data[0].items : [];
      setSelectedDimensions({...selectedDimensions, period: items});
    }
    setOpenPeriodFilter(false);
  };

  return (
    <Paper elevation={2}>
        <Container maxWidth={false}  style={{padding: 20}}>
          <Grid container spacing={5}>
            <Grid item>
              <SelectionWrapper
                  onClick={(_) => setOpenOrgUnitFilter(true)}
                  dataObj={selectedDimensions.orgUnit || {}}
                  type={FilterComponentTypes.ORG_UNIT}
              />
            </Grid>
            <Grid item>
              <SelectionWrapper
                  onClick={(_) => setOpenPeriodFilter(true)}
                  type={FilterComponentTypes.PERIOD}
                  periodItems={selectedDimensions.period || []}
              />
            </Grid>
          </Grid>

          {openPeriodFilter && (
              <PeriodFilter
                  onClose={(_) => setOpenPeriodFilter(false)}
                  onUpdate={onUpdatePeriodFilter}
                  initialPeriods={selectedDimensions.period}
              />
          )}
          {openOrgUnitFilter && (
              <OrganisationUnitFilter
                  onClose={(_) => setOpenOrgUnitFilter(false)}
                  onUpdate={onUpdateOrgUnitFilter}
                  initialOrgUnit={selectedDimensions.orgUnit}
              />
          )}
        </Container>
    </Paper>
  );
}

export default FilterComponents;
