import { useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import { useSetRecoilState, useRecoilValue, useRecoilState } from 'recoil';
import { Dhis2IconState } from '../states';
import {filter} from 'lodash'

const iconQuery = {
  data: {
    resource: 'icons',
    params: ({}) => ({
      totalCount: true,
    }),
  },
};

export function useDhis2Icons() {
  const { loading, data, error } = useDataQuery(iconQuery, { variables: {} });

  
  return { loading, error, dhis2Icons: data?.data || [] };
}
