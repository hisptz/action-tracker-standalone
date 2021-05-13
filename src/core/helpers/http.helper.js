export function getDataPaginationFilters(paginationData, pageSize = 50) {
    let paginationFilter = [];
  
    const pager =
        paginationData && paginationData.pager ? paginationData.pager : {};
    const total = pager && pager.total >= pageSize ? pager.total : pageSize;
    for (let page = 1; page <= Math.ceil(total / pageSize); page++) {

      // paginationFilter.push(`totalPages=true&pageSize=${pageSize}&page=${page}`);
      paginationFilter = [...paginationFilter, {totalPages: true, pageSize, page}];
    }
    return paginationFilter;
  }
