import { map, flattenDeep } from 'lodash';
const headerConstants = {
  dx: 'indicator',
  pe: 'period',
};
function formatAnalytics(analytics) {
  // console.log({analytics})
  const headers = analytics && analytics.headers ? analytics.headers : [];

  const transformedData = (analytics.rows || []).map((row) => {
    let obj = {};
    if (headers && headers.length) {
      for (const header of headers) {
        if (header && header.name) {
          const headerName = headerConstants[header?.name]
            ? headerConstants[header?.name]
            : header.name;
          obj = { ...obj, [headerName]: row[itemIndex(headers, header.name)] };
        }
      }
    }
    obj = { ...obj };
    return obj ? obj : [];
  });
  return flattenDeep(transformedData);
}
export function itemIndex(headers, headername) {
  const itemindex = (headers || []).findIndex(
    (head) => head.name === headername
  );
  return itemindex;
}

export { formatAnalytics };
