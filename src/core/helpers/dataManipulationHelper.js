import {BottleneckConstants } from '../constants';
import { findIndex, map, flattenDeep, uniq } from 'lodash';
export const listOfSelectedIndicatorsFromResponse = (response) => {
  const { headers, metaData, rows } = response || {};
  const indictorIndex = findIndex(
    headers || [],
    (header) => header && header.name && header.name === BottleneckConstants.INDICATOR_ATTRIBUTE
  );

  return uniq(
    flattenDeep(
      map(rows || [], (row) => {
        return row[indictorIndex] ? row[indictorIndex] : [];
      })
    )
  );
};
export const formatDataFilterOptions = (
  optionsList,
  indicatorsAlreadySelected
) => {
  return map(optionsList || [], (option) => {
    if (
      indicatorsAlreadySelected &&
      indicatorsAlreadySelected.length &&
      indicatorsAlreadySelected.includes(option?.value)
    ) {
      return { ...option, disabled: true };
    }
    return option;
  });
};
