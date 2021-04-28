import { useDataQuery } from '@dhis2/app-runtime';
import { getDataPaginationFilters } from '../helpers/HttpHelper';
import { requestResources } from '../constants/constants';
import { map, flattenDeep, find, keyBy } from 'lodash';
import { useEffect, useState } from 'react';
const orgUnitPaginationQuery = getOrganisationUnitQuery({
  pageSize: 1,
  totalPages: true,
  fields: 'none',
});
export function getOrganisationUnitTreeData(orgUnits) {
  return orgUnits && orgUnits.length
    ? keyBy(orgUnits, (orgUnit) => {
        return orgUnit && orgUnit.id ? `organisationUnits/${orgUnit.id}` : '';
      })
    : null;
}

export function useAllOrganisationUnits() {
  const [responseOrgUnitData, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const paginationData = useOrganisationUnitPaginationData();
  const paginationFilters = getDataPaginationFilters(paginationData, 50);
  let orgUnitsData = [];

  // const orgUnitsData = flattenDeep(
  //   map(paginationFilters || [], (filter) => {
  //     const { data, loading, error } = useDataQuery(
  //       getOrganisationUnitQuery({
  //         order: 'shortName:desc',
  //         fields: 'id,name,children[id,displayName,name,path],displayName,path',
  //         ...filter,
  //       })
  //     );

  //     return { data, loading, error };
  //   })
  // );
  if(paginationFilters && paginationFilters.length) {
    for(const filter of paginationFilters) {
      const { data, loading, error } = useDataQuery(
        getOrganisationUnitQuery({
          order: 'shortName:desc',
          fields: 'id,name,children[id,displayName,name,path],displayName,path',
          ...filter,
        })
      );
      orgUnitsData = [...orgUnitsData, { data, loading, error } ]
    }
  }
  useEffect(() => {
    function processData() {
      // setLoading(requestLoading);
      // setError(requestError);
      try {
        if (orgUnitsData && orgUnitsData.length) {
          const loadingStatus = paginatedOrgUnitRequestLoading(orgUnitsData);
          const requestError = paginatedOrgUnitRequestError(orgUnitsData);
          if (loadingStatus) {
            setLoading(loadingStatus);
          }
          if (requestError) {
            setLoading(requestError);
          }
           if(!loadingStatus && !requestError) {
            setData(formatPaginatedRequestData(orgUnitsData));
           }

        } else {
          setData([]);
        }
      } catch (e) {
        setError(e);
      }
    }
    processData();
  }, [orgUnitsData]);

  return { data: responseOrgUnitData, error, loading };
}
let organisationUnitQuery = ({level,id}) =>{
  return {
  organisationUnits: {
    resource: requestResources.ORG_UNIT,
    params: {
      order: 'shortName:desc',
      fields: 'id,name,children[id,displayName,name,path],displayName,path',
      level,
    },
    id
  },
}};
export function getOrgUnitId(expandData){
    const expandPath = expandData &&  expandData.path  ? expandData.path : '';
    const expandDataArr = expandPath.split("/");
    const expandArrSize = expandDataArr && expandDataArr.length? expandDataArr.length : 0;
    return expandDataArr[expandArrSize-1];
}
export function getOrgUnitLevel(expandData){
  const expandPath = expandData &&  expandData.path  ? expandData.path : '';
  const expandDataArr = expandPath.split("/");
  const expandArrSize = expandDataArr && expandDataArr.length? expandDataArr.length : 0;
  return expandArrSize-1;
}


// function paginatedOrgUnitRequestLoading(orgUnitsData) {
//   const orgUnitItemLoading = find(
//     orgUnitsData || [],
//     (orgUnitDataItem) => orgUnitDataItem.loading
//   );
//   return orgUnitItemLoading ? true : false;
// }
// function paginatedOrgUnitRequestError(orgUnitsData) {
//   const orgUnitItemWithError = find(
//     orgUnitsData || [],
//     (orgUnitDataItem) => orgUnitDataItem.error
//   );
//   return orgUnitItemWithError && orgUnitItemWithError.error
//     ? orgUnitItemWithError.error
//     : '';
// }
// function formatPaginatedRequestData(orgUnitsData) {
//   return flattenDeep(
//     map(orgUnitsData || [], (orgUnitDataItem) => {
//       return orgUnitDataItem &&
//         orgUnitDataItem.data &&
//         orgUnitDataItem.data.organisationUnits &&
//         orgUnitDataItem.data.organisationUnits.organisationUnits
//         ? orgUnitDataItem.data.organisationUnits.organisationUnits
//         : [];
//     })
//   );
// }

// export function useOrganisationUnitPaginationData() {
//   const [data, setData] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const {
//     error: requestError,
//     loading: requestLoading,
//     data: requestData,
//   } = useDataQuery(orgUnitPaginationQuery);

//   useEffect(() => {
//     function processData() {
//       setLoading(requestLoading);
//       setError(requestError);
//       try {
//         if (requestData && requestData.organisationUnits) {
//           setData(requestData.organisationUnits);
//         } else {
//           setData(null);
//         }
//       } catch (e) {
//         setError(e);
//       }
//     }
//     processData();
//   }, [requestData]);

//   return { error, loading, data };
// }
function getOrganisationUnitQuery(
  { ...params },
  resource = requestResources.ORG_UNIT
) {
  return params
    ? {
        organisationUnits: {
          resource: `${resource}.json`,
          params,
        },
      }
    : {
        organisationUnits: {
          resource: `${resource}.json`,
        },
      };
}


