import Bottleneck from '../models/bottleneck';
import {
  filter,
  map,
  maxBy,
  split,
  find,
  concat,
  mapValues,
  groupBy,
} from 'lodash';
import { GapConstants, ActionConstants } from '../constants';
import Action from '../models/action';
import ActionStatus from '../models/actionStatus';
import { Period } from '@iapps/period-utilities';
import { exportAsExcelFile } from '../helpers/excelHelper';

// Indicator Query
const bottleneckQuery = {
  indicators: {
    resource: 'trackedEntityInstances',
    params: ({ ou, page, pageSize, trackedEntityInstance, fields }) => ({
      program: 'Uvz0nfKVMQJ',
      page,
      pageSize,
      totalPages: true,
      ou,
      ouMode: 'DESCENDANTS',
      fields:
        fields === FIELDS_NONE
          ? FIELDS_NONE
          : [
              'trackedEntityInstance',
              'attributes[attribute,value]',
              'enrollments[events[programStage,event,dataValues[dataElement,value]]]',
            ],
      trackedEntityInstance,
    }),
  },
};

// Action Query

const actionsQuery = {
  actions: {
    resource: 'trackedEntityInstances',
    params: ({ ou, solutionToActionLinkage, page, pageSize, fields }) => ({
      program: 'unD7wro3qPm',
      ou,
      page,
      pageSize,
      ouMode: 'DESCENDANTS',
      totalPages: true,
      fields:
        fields && fields === 'none'
          ? fields
          : ActionConstants.ACTION_QUERY_FIELDS,
      filter: [
        `${ActionConstants.ACTION_TO_SOLUTION_LINKAGE}:eq:${solutionToActionLinkage}`,
      ],
    }),
  },
};

// Indicator Name Query
const indicatorNameQuery = {
  data: {
    resource: 'indicators',
    id: ({ id }) => id,
  },
};


/* Get Total Indicator response */
async function getTotalIndicatorsResponse({ engine, orgUnit }) {
  const indicatorPagingDetails = await getEngineQuery({
    engine,
    query: bottleneckQuery,
    queryKey: 'indicators',
    variables: { fields: FIELDS_NONE, ou: orgUnit?.id },
  });
  const pageCount = getPageCount(indicatorPagingDetails);
  return await getTotalResponseArray({
    pageCount,
    engine,
    query: bottleneckQuery,
    queryKey: 'indicators',
    ou: orgUnit?.id,
    resource: 'trackedEntityInstances',
  });
}
/* Get total response from the query */
async function getTotalResponseArray({
  pageCount,
  engine,
  query,
  queryKey,
  ou,
  resource,
  others,
}) {
  let totalResponse = [];
  if (pageCount >= 1) {
    for (let page = 1; page <= pageCount; page++) {
      const response = await getEngineQuery({
        engine,
        query,
        queryKey,
        variables: {
          ou,
          page,
          others: { trackedEntityInstance: [], ...others },
        },
      });
      totalResponse =
        response[resource] && response[resource]?.length
          ? [...totalResponse, ...response[resource]]
          : [...totalResponse];
    }
  }

  return totalResponse;
}
/* Get page Count from the response */
function getPageCount(response) {
  return response?.pager?.pageCount ? response?.pager?.pageCount : 0;
}
/* Get Engine Query */
async function getEngineQuery({
  engine,
  query,
  queryKey,
  variables: {
    ou,
    pageSize = 50,
    lazy = true,
    totalPages = true,
    fields,
    page = 1,
    others = {},
  },
}) {
  const response = await engine.query(query, {
    variables: {
      ou,
      page,
      pageSize,
      fields,
      ...others,
    },
    lazy,
  });

  return response[queryKey] ? response[queryKey] : [];
}
