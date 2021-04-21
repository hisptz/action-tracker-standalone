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

export function useDhis2Icons({ selectedCategory = { name: 'ALL', key: '' } }) {
  const { loading, data, error } = useDataQuery(iconQuery, { variables: {} });
  const setDhis2Icons = useSetRecoilState(Dhis2IconState);

  useEffect(() => {
    async function setIndicatorsSelectedData() {
      if (!loading && data && !error) {
       
        const dhis2Icons = data.data ? data.data : [];
        if (selectedCategory && selectedCategory.name === 'ALL') {
          setDhis2Icons(dhis2Icons);
        } else if (selectedCategory && selectedCategory !== 'ALL') {
          const filteredIcons = filter(dhis2Icons || [], (icon) => {
            const categoryStr = /[^_]*$/.exec(icon?.key)[0] || '';
            if (categoryStr === selectedCategory?.key) {
              return icon;
            }
          });
          setDhis2Icons(filteredIcons);
        } else {
          setDhis2Icons([]);
        }
      }
    }

    setIndicatorsSelectedData();
  }, [loading, selectedCategory]);
  return { loading, error };
}
