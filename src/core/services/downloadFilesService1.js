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

const FIELDS_NONE = 'none';
const FILE_TYPES = {
  pdf: 'pdf',
  excel: 'excel',
};
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

export async function getPdfDownloadData({
  engine,
  orgUnit,
  tableColumnsData,
  currentTab,
  selectedPeriod,
}) {
  const bottlenecks = await getTotalIndicatorsResponse({ engine, orgUnit });
  const payload = await getBottleneckCompletePayload({
    bottlenecks,
    engine,
    downloadType: FILE_TYPES.pdf,
    tableColumnsData,
    orgUnit,
    currentTab,
  });
  const formattedPayloadObj = mapValues(
    groupBy(payload || [], 'id'),
    (payloadItem) => payloadItem
  );
  const formattedPayloadArray = map(
    Object.keys(formattedPayloadObj) || [],
    (formattedDataGroupKey) => {
      return formattedPayloadObj[formattedDataGroupKey]
        ? {
            id: formattedDataGroupKey,
            items: formattedPayloadObj[formattedDataGroupKey],
          }
        : [];
    }
  );
  console.log({ formattedPayloadObj });
}

export async function downloadExcel1({
  engine,
  orgUnit,
  tableColumnsData,
  currentTab,
  selectedPeriod,
}) {
  const bottlenecks = await getTotalIndicatorsResponse({ engine, orgUnit });
  const payload = await getBottleneckCompletePayload({
    bottlenecks,
    engine,
    downloadType: FILE_TYPES.excel,
    tableColumnsData,
    orgUnit,
    currentTab,
  });
  const periodInstance = new Period();
  const period = periodInstance.getById(selectedPeriod[0]?.id) || {};
  await exportAsExcelFile(
    payload,
    `${orgUnit?.displayName || ''}-${period?.name || ''}  Action ${currentTab}`
  );
}

async function getBottleneckCompletePayload({
  bottlenecks,
  engine,
  downloadType,
  tableColumnsData,
  orgUnit,
  currentTab,
}) {
  let payload = [];

  if (bottlenecks?.length) {
    let gaps = [];
    for (const bottleneck of bottlenecks) {
      const formattedBottleneck = new Bottleneck(bottleneck)?.toJson();

      const indicatorObj = await getIndicatorValuesFromBottleneck({
        bottleneck: formattedBottleneck,
        engine,
        downloadType,
      });
      const formattedGaps = await getGapsFromBottleneck({
        gaps: formattedBottleneck?.gaps,
        engine,
        downloadType,
        tableColumnsData,
        orgUnit,
        indicatorObj,
        currentTab,
      });

      payload = [...payload, ...formattedGaps];
    }
    payload = [...payload, ...gaps];
  }
  return payload;
}

async function getGapsFromBottleneck({
  gaps,
  engine,
  downloadType,
  tableColumnsData,
  orgUnit,
  indicatorObj,
  currentTab,
}) {
  let formattedGaps = [];
  if (gaps?.length) {
    for (const gap of gaps) {
      let gapObject = gap.toJson();
      const visibleGapColumns = getVisibleColumnsFromGapsTable({
        downloadType,
        gap: gapObject,
        orgUnit,
        tableColumnsData,
        indicatorObj,
      });
      const possibleSolutions = await getPossibleSolutionsFromGap({
        possibleSolutions: gapObject?.possibleSolutions,
        engine,
        orgUnit,
        gapColumns: visibleGapColumns,
        downloadType,
        tableColumnsData,
        currentTab,
      });
      formattedGaps = [...formattedGaps, ...possibleSolutions];
    }
  } else {
    const { visibleColumnsNames } = tableColumnsData || {
      visibleColumnsNames: [],
    };

    formattedGaps = indicatorObj
      ? [...formattedGaps, indicatorObj]
      : [...formattedGaps];
    formattedGaps =
      downloadType === FILE_TYPES.excel
        ? map(formattedGaps || [], (gap) => {
            let newGap = gap;
            map(visibleColumnsNames || [], (column) => {
              newGap = gap[column]
                ? { ...newGap }
                : { ...newGap, [column]: '' };
            });
            return newGap;
          })
        : [...formattedGaps];
  }
  return formattedGaps;
}

async function getPossibleSolutionsFromGap({
  possibleSolutions,
  engine,
  orgUnit,
  gapColumns,
  downloadType,
  tableColumnsData,
  currentTab,
}) {
  let formattedPossibleSolutions = [];
  if (possibleSolutions?.length) {
    for (const possibleSolution of possibleSolutions) {
      let possibleSolutionObject = possibleSolution.toJson();
      const visibleSolutions = await getVisibleColumnsFromSolutionsTable({
        downloadType,
        possibleSolution: possibleSolutionObject,
        tableColumnsData,
        gapColumns,
      });
      const actions = await getActionFromPossibleSolution({
        engine,
        orgUnit,
        solutionToActionLinkage: possibleSolutionObject?.actionLinkage,
        solutionsObj: visibleSolutions,
        tableColumnsData,
        downloadType,
        currentTab,
      });
      formattedPossibleSolutions = [...formattedPossibleSolutions, ...actions];
    }
  } else {
    formattedPossibleSolutions = [...formattedPossibleSolutions, gapColumns];
    const { visibleColumnsNames } = tableColumnsData || {
      visibleColumnsNames: [],
    };

    formattedPossibleSolutions =
      downloadType === FILE_TYPES.excel
        ? map(formattedPossibleSolutions || [], (solution) => {
            let newSolution = solution;
            map(visibleColumnsNames || [], (column) => {
              newSolution = solution[column]
                ? { ...newSolution }
                : { ...newSolution, [column]: '' };
            });
            return newSolution;
          })
        : [...formattedPossibleSolutions];
  }
  return formattedPossibleSolutions;
}

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
async function getIndicatorName({ indicator, engine }) {
  const { data } = await engine.query(indicatorNameQuery, {
    variables: { id: indicator },
  });
  return data && data.displayName ? data.displayName : '';
}

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

function getPageCount(response) {
  return response?.pager?.pageCount ? response?.pager?.pageCount : 0;
}
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

function getActionStatusObject({
  action,
  currentTab,
  downloadType,
  tableColumnsData,
}) {
  let actionStatusesObj = {};
  const { actionStatus } = action || {};

  const statusObj = maxBy(
    actionStatus || [],
    (actionStatusItem) => new Date(actionStatusItem?.reviewDate)
  );
  if (currentTab === 'Planning') {
    actionStatusesObj =
      statusObj?.status && downloadType === 'excel'
        ? { ...actionStatusesObj, Status: statusObj.status }
        : statusObj && statusObj.status && downloadType === 'pdf'
        ? { ...actionStatusesObj, status: statusObj.status }
        : {};
  }
  return actionStatusesObj;
}

function getActionStatuses({
  action,
  currentTab,
  downloadType,
  tableColumnsData,
}) {
  let actionStatusesObj = {};
  const { actionStatus } = action || {};

  if (currentTab === 'Tracking') {
    const periodInstance = new Period();

    const { columns } = tableColumnsData?.actionStatusTable || { columns: [] };

    if (columns?.length) {
      for (const column of columns) {
        const periodValues = periodInstance.getById(column?.id);
        const formattedStartDate = new Date(validDate(periodValues.startDate));
        const formattedEndDate = new Date(validDate(periodValues.endDate));
        const dateInGivenColumn = find(actionStatus || [], (status) => {
          const formattedReviewDate = new Date(status?.reviewDate);

          if (
            formattedReviewDate >= formattedStartDate &&
            formattedReviewDate <= formattedEndDate
          ) {
            return status;
          }
        });

        actionStatusesObj = {
          ...actionStatusesObj,
          [column?.name]: dateInGivenColumn?.status || '',
        };
      }
    }
  }

  return actionStatusesObj;
}

function validDate(date) {
  let dateStr = '';
  const dateArr = split(date, '-').reverse();
  if (dateArr && dateArr.length) {
    for (
      let dateItemIndex = 0;
      dateItemIndex < dateArr.length;
      dateItemIndex++
    ) {
      dateStr =
        dateItemIndex === dateArr.length - 1
          ? `${dateStr}${dateArr[dateItemIndex]}`
          : `${dateStr}${dateArr[dateItemIndex]}-`;
    }
  }
  return dateStr;
}
function getColumnKeyByDownloadType({ downloadType, column, value }) {
  return downloadType === FILE_TYPES.excel
    ? { [column?.displayName]: value || '' }
    : downloadType === FILE_TYPES.pdf
    ? {
        [column?.name]: value || ''
      }
    : {};
}
function getRemainedColumnsInRow({
  downloadType,
  tableColumnsData,
  formattedData,
}) {
  if (downloadType === FILE_TYPES.excel) {
    const { visibleColumnsNames } = tableColumnsData || {
      visibleColumnsNames: [],
    };

    return map(formattedData || [], (formattedDataItem) => {
      let newFormattedDataItem = formattedData;
      map(visibleColumnsNames || [], (column) => {
        newFormattedDataItem = formattedDataItem[column]
          ? { ...newFormattedDataItem }
          : { ...newFormattedDataItem, [column]: '' };
      });
      return newFormattedDataItem;
    });
  }
  return formattedData;
}