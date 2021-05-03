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




async function getActionFromPossibleSolution({
  solutionToActionLinkage,
  engine,
  orgUnit,
  solutionsObj,
  tableColumnsData,
  downloadType,
  currentTab,
}) {
  let actionsArr = [];

  const actions = await getTotalActionsResponse({
    engine,
    solutionToActionLinkage,
    orgUnit,
  });

  const formattedActions = getFormattedActions(actions);
  if (formattedActions?.length) {
    for (const action of formattedActions) {
      const visibleActionsColumns = getVisibleColumnsFromActionsTable({
        downloadType,
        action,
        solutionsObj,
        tableColumnsData,
        currentTab,
      });
      actionsArr = [...actionsArr, visibleActionsColumns];
    }
  }
  return actionsArr;
}

function getVisibleColumnsFromActionsTable({
  downloadType,
  action,
  tableColumnsData,
  solutionsObj,
  currentTab,
}) {
  let visibleActionObj = { ...solutionsObj };
  const { actionsTable } = tableColumnsData;
  const actionStatusObj = getActionStatuses({
    action,
    currentTab,
    tableColumnsData,
    downloadType,
  });
  map(
    filter(
      actionsTable?.columns || [],
      (actionColumn) => actionColumn.visible
    ) || [],
    (filteredActionColumn) => {
      visibleActionObj = {
        ...visibleActionObj,
        ...getActionVisibleColumn({
          column: filteredActionColumn,
          action,
          currentTab,
          tableColumnsData,
          downloadType,
        }),
        ...actionStatusObj,
      };
    }
  );
  return visibleActionObj;
}

function getActionVisibleColumn({
  column,
  action,
  currentTab,
  tableColumnsData,
  downloadType,
}) {
  switch (column?.name) {
    case 'action':
      return getColumnKeyByDownloadType({
        downloadType,
        column,
        value: action?.title,
      });
    case 'responsiblePerson':
      return getColumnKeyByDownloadType({
        downloadType,
        column,
        value: action?.responsiblePerson,
      });
    case 'startDate':
      return getColumnKeyByDownloadType({
        downloadType,
        column,
        value: action?.startDate,
      });
    case 'endDate':
      return getColumnKeyByDownloadType({
        downloadType,
        column,
        value: action?.endDate,
      });
    case 'status':
      const actionStatusObj = getActionStatusObject({
        action,
        currentTab,
        tableColumnsData,
        downloadType,
      });
      return actionStatusObj;
    default:
      return null;
  }
}

async function getTotalActionsResponse({
  engine,
  orgUnit,
  solutionToActionLinkage,
}) {
  const actionsPagingDetails = await getEngineQuery({
    engine,
    query: actionsQuery,
    queryKey: 'actions',
    variables: {
      fields: FIELDS_NONE,
      ou: orgUnit?.id,
      others: { solutionToActionLinkage },
    },
  });
  const pageCount = getPageCount(actionsPagingDetails);
  return await getTotalResponseArray({
    pageCount,
    engine,
    query: actionsQuery,
    queryKey: 'actions',
    ou: orgUnit?.id,
    resource: 'trackedEntityInstances',
    others: { solutionToActionLinkage },
  });
}

function getFormattedActions(teis) {
  let formattedTeis = [];
  if (teis && teis.length) {
    for (const tei of teis) {
      let action = new Action(tei).toJson();
      // const gaps = await getGaps(bottleneck.id, engine)
      const actionStatusEvents =
        tei?.enrollments[0] && tei?.enrollments[0]?.events
          ? tei.enrollments[0].events
          : [];
      const actionStatus = getFormattedActionStatusEvents(actionStatusEvents);

      formattedTeis = [...formattedTeis, { ...action, actionStatus }];
    }
  }
  return formattedTeis;
}

function getFormattedActionStatusEvents(actionStatusEvents) {
  let formattedEvents = [];
  if (actionStatusEvents && actionStatusEvents.length) {
    for (const event of actionStatusEvents) {
      let eventObject = new ActionStatus(event)?.toJson();

      formattedEvents = [...formattedEvents, eventObject];
    }
  }
  return formattedEvents;
}


/* Get solution visible columns */
async function getVisibleColumnsFromSolutionsTable({
  downloadType,
  possibleSolution,
  tableColumnsData,
  gapColumns,
}) {
  let visibleSolutionObj = { ...gapColumns };
  const { solutionsTable } = tableColumnsData;
  map(
    filter(
      solutionsTable?.columns || [],
      (solutionColumn) => solutionColumn.visible
    ) || [],
    (filteredSolutionColumn) => {
      visibleSolutionObj = {
        ...visibleSolutionObj,
        ...getSolutionVisibleColumn({
          column: filteredSolutionColumn,
          solution: possibleSolution,
          downloadType,
        }),
      };
    }
  );
  return visibleSolutionObj;
}
/* Get solution visible column key and value */
function getSolutionVisibleColumn({ column, solution, downloadType }) {
  switch (column?.name) {
    case 'possibleSolution':
      return getColumnKeyByDownloadType({
        column,
        downloadType,
        value: solution?.solution,
      });
    default:
      return null;
  }
}

/* Get Gap Visible Column from Gaps Table */
function getVisibleColumnsFromGapsTable({
  downloadType,
  gap,
  orgUnit,
  tableColumnsData,
  indicatorObj,
}) {
  let visibleGapObj = { ...indicatorObj };
  const { gapsTable } = tableColumnsData;
  map(
    filter(gapsTable.columns || [], (gapColumn) => gapColumn.visible) || [],
    (filteredGapColumn) => {
      visibleGapObj = {
        ...visibleGapObj,
        ...getGapVisibleColumn({
          column: filteredGapColumn,
          gap,
          orgUnit,
          downloadType,
        }),
      };
    }
  );
  return visibleGapObj;
}

/* Get Gap Visible Columns */
function getGapVisibleColumn({ column, gap, orgUnit, downloadType }) {
  switch (column?.name) {
    case 'gap':
      return getColumnKeyByDownloadType({
        downloadType,
        column,
        value: gap?.title,
      });
    case 'orgUnit':
      return getColumnKeyByDownloadType({
        downloadType,
        column,
        value: orgUnit?.displayName,
      });
    default:
      return null;
  }
}


/* Get column key by download type  */
function getColumnKeyByDownloadType({ downloadType, column, value }) {
  return downloadType === FILE_TYPES.excel
    ? { [column?.displayName]: value || '' }
    : downloadType === FILE_TYPES.pdf
    ? {
        [column?.name]: value || ''
      }
    : {};
}
/* Get Indicator values columns */
async function getIndicatorValuesFromBottleneck({
  bottleneck,
  engine,
  downloadType,
}) {
  const indicatorName = await getIndicatorName({
    indicator: bottleneck?.indicator,
    engine,
  });
  return downloadType === FILE_TYPES.excel
    ? {
        Indicator: indicatorName || '',
        Intervention: bottleneck?.intervention || '',
      }
    : {
        indicator: indicatorName || '',
        intervention: bottleneck?.intervention || '',
        id: bottleneck?.id || '',
      };
}
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
