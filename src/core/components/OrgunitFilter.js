import './styles/OrgUnitFilter.css';
import { CustomDataProvider, useDataQuery } from '@dhis2/app-runtime';
import { OrganisationUnitTree } from '@dhis2/ui';
import { requestResources } from '../constants/constants';
import {
  getOrganisationUnitTreeData,
  getOrgUnitId,
  getOrgUnitLevel
} from '../services/OrgUnitService';
import { useEffect, useState } from 'react';
import { map } from 'lodash';
import useOrganisationUnits from '../helpers/useOrganisationUnits';

const orgUnitFilterWrapper = {
  border: '1px solid #d3d3d3',
  padding: '1em',
  width: '45%',
};

export const OrgunitFilter = () => {
  let orgUnitsTreeDataObj = {};
  let orgUnitRoots = [];
  const { loading, data, error, setId, setLevel } = useOrganisationUnits(1);

  if (
    data &&
    data.organisationUnits &&
    data.organisationUnits.organisationUnits
  ) {
    const organisationUnits = data.organisationUnits.organisationUnits;
    orgUnitsTreeDataObj = getOrganisationUnitTreeData(organisationUnits)
      ? {
          ...orgUnitsTreeDataObj,
          ...getOrganisationUnitTreeData(organisationUnits),
        }
      : orgUnitsTreeDataObj;
    // setOrgUnitTreeData(orgUnitsTreeDataObj);
    orgUnitRoots = map(organisationUnits || [], (organisationUnit) => {
      return organisationUnit ? organisationUnit.id : '';
    });
  }
  // console.log(orgUnitsTreeData);

  return (
    <div style={orgUnitFilterWrapper}>
      {data && orgUnitsTreeDataObj ? (
        <CustomDataProvider data={orgUnitsTreeDataObj}>
          <OrganisationUnitTree
            dataTest="dhis2-uiwidgets-orgunittree"
            filter={[]}
            highlighted={[]}
            initiallyExpanded={[]}
            name="Root org unit"
            onChange={function onChange() {}}
            onExpand={function onExapand($event) {
              setId(getOrgUnitId($event));
              setLevel(getOrgUnitLevel($event));
            }}
            onChildrenLoaded={function onChildrenLoaded() {}}
            roots={orgUnitRoots}
            selected={[]}
            singleSelection
          />
        </CustomDataProvider>
      ) : (
        <span>No orgunits</span>
      )}
    </div>
  );
};

export default OrgunitFilter;
