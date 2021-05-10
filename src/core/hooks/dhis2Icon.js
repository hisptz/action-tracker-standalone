import { useDataQuery } from '@dhis2/app-runtime';

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
