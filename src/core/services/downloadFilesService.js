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
