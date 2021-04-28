import Bottleneck from '../models/bottleneck';
import { map, find, maxBy, filter, groupBy, mapValues, split, flattenDeep } from 'lodash';
import { GapConstants, ActionConstants } from '../constants';
import Action from '../models/action';
import ActionStatus from '../models/actionStatus';
import { exportAsExcelFile } from '../helpers/excelHelper';
import { v4 as uuidv4 } from 'uuid';
import { Period } from '@iapps/period-utilities';

/* Queries variables */
const indicatorQuery = {
  indicators: {
    resource: 'trackedEntityInstances',
    params: ({ ou, page, pageSize, trackedEntityInstance, fields }) => ({
      program: 'Uvz0nfKVMQJ',
      page,
      pageSize,
      totalPages: true,
      ou,
      fields:
        fields === 'none'
          ? 'none'
          : [
              'trackedEntityInstance',
              'attributes[attribute,value]',
              'enrollments[events[programStage,event,dataValues[dataElement,value]]]',
            ],
      trackedEntityInstance,
    }),
  },
};

const actionsQuery = {
  actions: {
    resource: 'trackedEntityInstances',
    params: ({ ou, solutionToActionLinkage, page, pageSize, fields }) => ({
      program: 'unD7wro3qPm',
      ou,
      page,
      pageSize,
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

const indicatorNameQuery = {
  data: {
    resource: 'indicators',
    id: ({ id }) => id,
  },
};
export async function getPDFDownloadData({
  engine,
  orgUnit,
  currentTab,
  selectedPeriod,
  page = 1,
  pageSize = 50,
  tableColumnsData
}) {
  const { indicators } = await engine.query(indicatorQuery, {
    variables: { ou: orgUnit?.id, page, pageSize, trackedEntityInstance: [] },
    lazy: true,
  });

  return await getDownloadData({
    indicators,
    orgUnit,
    pageSize,
    engine,
    currentTab,
    selectedPeriod,
    tableColumnsData
  });
}

export async function downloadExcel({
  engine,
  orgUnit,
  page = 1,
  pageSize = 50,
  currentTab,
  selectedPeriod,
  tableColumnsData
}) {
  let teis = [];
  const { indicators } = await engine.query(indicatorQuery, {
    variables: {
      ou: orgUnit?.id,
      page,
      pageSize,
      trackedEntityInstance: [],
      fields: 'none',
    },
    lazy: true,
  });

  const pager = indicators && indicators.pager ? indicators.pager : {};
  const { pageCount } = pager;

  if (pageCount >= 1) {
    for (let pageIndex = 1; pageIndex <= pageCount; pageIndex++) {
      const response = await engine.query(indicatorQuery, {
        variables: {
          ou: orgUnit?.id,
          page: pageIndex,
          pageSize,
          trackedEntityInstance: [],
        },
        lazy: true,
      });
      teis =
        response &&
        response.indicators &&
        response.indicators.trackedEntityInstances
          ? [...teis, ...response.indicators.trackedEntityInstances]
          : [...teis];
    }
  }

  const formattedTeis = await getFormattedTeis(teis, engine, orgUnit);
  const downloadData = await formatDataForDownload({
    formattedTeis,
    engine,
    currentTab,
    selectedPeriod,
    downloadType: 'excel',
    tableColumnsData
  });
  const periodInstance = new Period();
  const period= periodInstance.getById(selectedPeriod[0]?.id) || {};
  await exportAsExcelFile(downloadData, `${orgUnit?.displayName || ''}-${period?.name || ''}  Action ${currentTab}`);
}

async function getDownloadData({
  indicators,
  engine,
  orgUnit,
  selectedPeriod,
  pageSize = 50,
  currentTab,
  tableColumnsData
}) {
  const pager = indicators && indicators.pager ? indicators.pager : {};
  const { pageCount } = pager;
  let teis = [];

  if (pageCount >= 1) {
    for (let pageIndex = 1; pageIndex <= pageCount; pageIndex++) {
      const response = await engine.query(indicatorQuery, {
        variables: {
          ou: orgUnit?.id,
          page: pageIndex,
          pageSize,
          trackedEntityInstance: [],
        },
        lazy: true,
      });
      teis =
        response &&
        response.indicators &&
        response.indicators.trackedEntityInstances
          ? [...teis, ...response.indicators.trackedEntityInstances]
          : [...teis];
    }
  }

  const formattedData = await getFormattedTeis(teis, engine, orgUnit);
  const downloadFormattedData = await formatDataForDownload({
    formattedTeis: formattedData,
    engine,
    downloadType: 'pdf',
    selectedPeriod,
    currentTab,
    tableColumnsData
  });
  const groupedFormattedDataObj = mapValues(
    groupBy(downloadFormattedData || [], 'id'),
    (formattedDataItemsList) =>
      formattedDataItemsList.map((formattedDataItem) => formattedDataItem)
  );
  return map(
    Object.keys(groupedFormattedDataObj) || [],
    (formattedDataGroupKey) => {
      return groupedFormattedDataObj &&
        groupedFormattedDataObj[formattedDataGroupKey]
        ? {
            id: formattedDataGroupKey,
            items: groupedFormattedDataObj[formattedDataGroupKey],
          }
        : [];
    }
  );
}
async function getIndicatorName(indicatorId, engine) {
  const { data } = await engine.query(indicatorNameQuery, {
    variables: { id: indicatorId },
  });
  return data && data.displayName ? data.displayName : '';
}

async function getFormattedTeis(teis, engine, orgUnit) {
  let formattedTeis = [];
  if (teis && teis.length) {
    for (const tei of teis) {
      let bottleneck = new Bottleneck(tei).toJson();
      // const gaps = await getGaps(bottleneck.id, engine)
      const indicatorName = await getIndicatorName(
        bottleneck?.indicator,
        engine
      );
      const gaps = await getFormattedGaps(bottleneck.gaps, engine, orgUnit);
      formattedTeis = [
        ...formattedTeis,
        { ...bottleneck, gaps, indicatorName },
      ];
    }
  }
  return formattedTeis;
}

async function getFormattedGaps(gaps, engine, orgUnit) {
  let formattedGaps = [];
  if (gaps && gaps.length) {
    for (const gap of gaps) {
      let gapObject = gap.toJson();
      gapObject = {
        ...gapObject,
        possibleSolutions: await getFormattedPossibleSolutions(
          gap?.possibleSolutions,
          engine,
          orgUnit
        ),
      };
      formattedGaps = [...formattedGaps, gapObject];
    }
  }
  return formattedGaps;
}
async function getFormattedPossibleSolutions(
  possibleSolutions,
  engine,
  orgUnit
) {
  let formattedPossibleSolutions = [];
  if (possibleSolutions && possibleSolutions.length) {
    for (const possibleSolution of possibleSolutions) {
      let possibleSolutionObject = possibleSolution.toJson();
      const actions = await getActionFromPossibleSolution({
        actionLinkage: possibleSolutionObject?.actionLinkage,
        engine,
        orgUnit,
      });
      formattedPossibleSolutions = [
        ...formattedPossibleSolutions,
        { ...possibleSolutionObject, actions },
      ];
    }
  }
  return formattedPossibleSolutions;
}

async function getActionFromPossibleSolution({
  actionLinkage,
  engine,
  orgUnit,
  pageSize = 50,
}) {
  let actionsArr = [];
  const { actions } = await engine.query(actionsQuery, {
    variables: {
      ou: orgUnit?.id,
      solutionToActionLinkage: actionLinkage,
      page: 1,
      pageSize,
      fields: 'none',
    },
    lazy: true,
  });
  const { pager } = actions || { pager: null };
  const { pageCount } = pager || { pageCount: 0 };
  if (pageCount && pageCount > 0) {
    for (let pageIndex = 1; pageIndex <= pageCount; pageIndex++) {
      const response = await engine.query(actionsQuery, {
        variables: {
          ou: orgUnit?.id,
          solutionToActionLinkage: actionLinkage,
          page: 1,
          pageSize,
        },
        lazy: true,
      });

      const { trackedEntityInstances } = response?.actions || {
        trackedEntityInstances: [],
      };

      actionsArr = [...actionsArr, ...trackedEntityInstances];
    }
  }

  return await getFormattedActions(actionsArr, engine);
}

async function getFormattedActions(teis, engine) {
  let formattedTeis = [];
  if (teis && teis.length) {
    for (const tei of teis) {
      let action = new Action(tei).toJson();
      // const gaps = await getGaps(bottleneck.id, engine)
      const actionStatusEvents =
        tei && tei.enrollments[0] && tei.enrollments[0].events
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

async function formatDataForDownload({
  formattedTeis,
  engine,
  downloadType = 'excel',
  currentTab = 'Planning',
  selectedPeriod,
  tableColumnsData
}) {
  let formatted = [];
  if (formattedTeis && formattedTeis.length) {
    for (const tei of formattedTeis) {
      const indicatorName = await getIndicatorName(tei?.indicator, engine);

      if (tei && tei.gaps && tei.gaps.length) {
        for (const gap of tei.gaps) {
          if (gap && gap.possibleSolutions) {
            for (const possibleSolution of gap.possibleSolutions) {
              if (possibleSolution && possibleSolution.actions) {
                for (const action of possibleSolution.actions) {
                  let actionStatusesObj = getActionStatusObject({
                    action,
                    currentTab,
                    downloadType,
                    selectedPeriod,
                    tableColumnsData
                  });
                  
                  const formattedObj = getRowObjectByDownloadType({
                    downloadType,
                    tei,
                    gap,
                    action,
                    possibleSolution,
                    actionStatusesObj,
                    indicatorName,
                    selectedPeriod,
                  });

                  formatted = [...formatted, formattedObj];
                }
              }
            }
          }
        }
      }
    }
  }
  return formatted;
}


function getRowObjectByDownloadType({
  downloadType,
  tei,
  gap,
  action,
  possibleSolution,
  actionStatusesObj,
  indicatorName,
  selectedPeriod,
}) {

  let statuses =  map(Object.keys(actionStatusesObj) || [], statusKey => {
    return statusKey ? actionStatusesObj[statusKey] : '';
  })
 
  
  
  return downloadType === 'excel'
    ? {
        Indicator: indicatorName,
        Gap: gap?.description || '',
        'Possible Solutions': possibleSolution?.solution || '',
        'Action Items': action?.description || '',
        'Responsible Person': action?.responsiblePerson || '',
        'Start Date': action?.startDate || '',
        'End Date': action?.endDate || '',
        ...actionStatusesObj,
      }
    : downloadType === 'pdf'
    ? {
        id: tei?.id || '',
        indicator: indicatorName,
        gapId: gap?.id || '',
        gap: gap?.description || '',
        possibleSolution: possibleSolution?.solution || '',
        actionItem: action?.description || '',
        responsiblePerson: action?.responsiblePerson || '',
        startDate: action?.startDate || '',
        endDate: action?.endDate || '',
        rowId: uuidv4(),
        statuses
      }
    : {};
}

function getActionStatusObject({
  action,
  currentTab,
  downloadType,
  selectedPeriod,
  tableColumnsData
}) {
  let actionStatusesObj = {};
  const { actionStatus } = action || {};
 
  const statusObj = maxBy(
    actionStatus || [],
    (actionStatusItem) => new Date(actionStatusItem?.reviewDate)
  );
  if (currentTab === 'Planning') {
  actionStatusesObj =
    statusObj && statusObj.status && downloadType === 'excel'
      ? { ...actionStatusesObj, Status: statusObj.status }
      : statusObj && statusObj.status && downloadType === 'pdf'
      ? { ...actionStatusesObj, status: statusObj.status }
      : {};
  }
 if (currentTab === 'Tracking') {
  
    
    const periodInstance = new Period();
    const { quarterly } = periodInstance.getById(selectedPeriod[0]?.id) || {};

     
   const {columns} = tableColumnsData?.actionStatusTable || {columns: []};

   if(columns?.length) {
    
    for (const column of columns) {

      const periodValues = periodInstance.getById(column?.id)
      const formattedStartDate = new Date(validDate(periodValues.startDate));
      const formattedEndDate = new Date(validDate(periodValues.endDate));
      const dateInGivenColumn = find(actionStatus || [], status => {
        const formattedReviewDate = new Date(status?.reviewDate);
       
         if(formattedReviewDate >= formattedStartDate &&
          formattedReviewDate <=formattedEndDate) {
            return status;
          }
      });

      actionStatusesObj = { ...actionStatusesObj, [column?.name]: dateInGivenColumn?.status || '' };
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
        dateItemIndex === (dateArr.length - 1) 
          ? `${dateStr}${dateArr[dateItemIndex]}`
          : `${dateStr}${dateArr[dateItemIndex]}-`;
    }
  }
  return dateStr;
}
