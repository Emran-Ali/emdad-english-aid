// hooks/useDataTableFetchData.js
import React, { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import useSWR from 'swr';
import { apiGet } from '@emran/lib/axios';

export const countPaginatePage = (totalData, limit) => {
    return totalData < 1 ? 0 : Math.ceil(totalData / limit);
};

const useDataTableFetchData = ({
                                   urlPath,
                                   filters: mappedFilters,
                                   orders: mappedOrders,
                                   paramsValueModifier,
                               }) => {
    const [pageCount, setPageCount] = React.useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [params, setParams] = useState({});
    const [toggleRefresh, setToggleRefresh] = useState(false);

    const {
        data: tableData,
        error,
        mutate,
    } = useSWR(
        params?.page && params?.per_page
            ? [urlPath, params, toggleRefresh, mappedFilters]
            : null,
        (urlPath) => {
            return apiGet(urlPath[0], { params: urlPath[1] });
        },
    );

    const onFetchData = useCallback(
        ({
             table,
             pageIndex,
             pageSize,
             sorting,
             search,
             filters,
             toggleRefresh,
         }) => {
            const columDefs = table._getColumnDefs();
            let _params = {
                page: pageIndex + 1,
                per_page: pageSize,
            };

            const orderArr = [];
            (sorting || []).forEach((item) => {
                orderArr.push({
                    column: item.id,
                    direction: item.desc ? 'DESC' : 'ASC',
                });
            });

            (filters || []).forEach((item) => {
                _params[item.id] = item.value;
            });

            if (mappedFilters) {
                mappedFilters.forEach((filter) => {
                    _params[filter.column] = filter.value;
                });
            }

            if (orderArr.length) {
                orderArr.forEach((order) => {
                    _params[`order[${order.column}]`] = order.direction;
                });
            }

            if (typeof search === 'string' && search.trim().length) {
                _params.search = search;
            }

            setParams(_params);
            setToggleRefresh(toggleRefresh);
        },
        [mappedFilters],
    );

    useEffect(() => {
        if (tableData) {
            setTotalCount(tableData?.data?.meta?.total);
            setPageCount(
                countPaginatePage(tableData?.data?.meta?.total, params?.per_page),
            );
        }
    }, [tableData]);

    // Debounce the fetch function to prevent too many API calls
    const dFetchData = debounce(onFetchData, 500);

    return {
        onFetchData: dFetchData,
        data: tableData?.data?.data || [],
        summary: tableData?.data?.summary || [],
        loading: !tableData && !error,
        pageCount,
        totalCount,
        mutate,
    };
};

export default useDataTableFetchData;