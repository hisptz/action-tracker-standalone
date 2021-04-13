import Bottleneck from '../models/bottleneck';
import { map, flattenDeep, groupBy, mapValues } from 'lodash';
import Gap from '../models/gap';
// import {GapConstants} from "../../../../core/constants";
import { GapConstants, ActionConstants } from '../constants';
import Action from '../models/action';
import ActionStatus from '../models/actionStatus';
import { exportAsExcelFile } from '../helpers/excelHelper';
import { v4 as uuidv4 } from 'uuid';

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
        fields && fields === 'none'
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
  page = 1,
  pageSize = 50,
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
  });
  // return await formatDataForDownload(downloadData, engine, 'pdf');
}

export async function downloadExcel({
  engine,
  orgUnit,
  page = 1,
  pageSize = 50,
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
  const downloadData = await formatDataForDownload(formattedTeis, engine);
  await exportAsExcelFile(downloadData, 'testing-file');
}

async function getDownloadData({ indicators, engine, orgUnit, pageSize = 50 }) {
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
   const downloadFormattedData = await formatDataForDownload(formattedData,engine, 'pdf')
  const groupedFormattedDataObj = mapValues(
    groupBy(downloadFormattedData || [], 'id'),
    (formattedDataItemsList) =>
      formattedDataItemsList.map((formattedDataItem) => formattedDataItem
      )
  );
  return map(
    Object.keys(groupedFormattedDataObj) || [],
    (formattedDataGroupKey) => {
      return groupedFormattedDataObj &&
        groupedFormattedDataObj[formattedDataGroupKey]
        ? {id: formattedDataGroupKey, items: groupedFormattedDataObj[formattedDataGroupKey] }
        : [];
    }
  );

  //return await formatDataForDownload(formattedTeis, engine);
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

async function formatDataForDownload(
  formattedTeis,
  engine,
  downloadType = 'excel'
) {
  let formatted = [];
  if (formattedTeis && formattedTeis.length) {
    let formattedTeisIndex = 0;
    for (const tei of formattedTeis) {
      const indicatorName = await getIndicatorName(tei?.indicator, engine);

      if (tei && tei.gaps && tei.gaps.length) {
        for (const gap of tei.gaps) {
          if (gap && gap.possibleSolutions) {
            for (const possibleSolution of gap.possibleSolutions) {
              if (possibleSolution && possibleSolution.actions) {
                for (const action of possibleSolution.actions) {
                  let actionStatusesObj = {};
                  flattenDeep(
                    map(action.actionStatus || [], (statusItem) => {
                      if (statusItem && statusItem.reviewDate) {
                        actionStatusesObj = {
                          ...actionStatusesObj,
                          [statusItem.reviewDate]: statusItem?.status || '',
                        };
                        return {
                          [statusItem.reviewDate]: statusItem?.status || '',
                        };
                      }
                      return [];
                    })
                  );

                  let formattedObj = {};
                  if (downloadType === 'excel') {
                    formattedObj = {
                      ...formattedObj,
                      Indicator: indicatorName,
                      Gap: gap?.description || '',
                      'Possible Solutions': possibleSolution?.solution || '',
                      'Action Items': action?.description || '',
                      'Responsible Person': action?.responsiblePerson || '',
                      'Start Date': action?.startDate || '',
                      'End Date': action?.endDate || '',
                      ...actionStatusesObj,
                    };
                  } else {
                    formattedObj = {
                      ...formattedObj,
                      id: tei?.id || '',
                      indicator: indicatorName,
                      gapId: gap?.id || '',
                      gap: gap?.description || '',
                      possibleSolution: possibleSolution?.solution || '',
                      actionItem: action?.description || '',
                      responsiblePerson: action?.responsiblePerson || '',
                      startDate: action?.startDate || '',
                      endDate: action?.endDate || '',
                      rowId: uuidv4()
                    };
                  }

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
