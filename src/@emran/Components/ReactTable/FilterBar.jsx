import React, { useState, useEffect } from 'react';
import { FaFilter } from 'react-icons/fa';
import FilterField from "@emran/Components/ReactTable/FilterField"; // For collapsing behavior

const FilterBar = ({
                    tableInstance,
                    setGlobalFilter,
                    resetColumnFilters,
                    setColumnFilters,
                    columnFilters,
                    onRefreshCallback,
                    filterConfig,
                    onFetchData,
                    topBarTitle,
                }) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const hasFilters = tableInstance
            .getHeaderGroups()
            .some((headerGroup) =>
                headerGroup.headers.some((header) => header.column.getCanFilter()),
            );
    }, [tableInstance]);

    const handleFilterChange = (newFilters) => {
        setColumnFilters(newFilters);

        const params = {
            table: tableInstance,
            pageIndex: tableInstance.getState().pagination.pageIndex,
            pageSize: tableInstance.getState().pagination.pageSize,
            sorting: tableInstance.getState().sorting,
            search: '',
            filters: newFilters,
            toggleRefresh: Date.now(),
        };
        onFetchData && onFetchData(params);
    };

    return (
        <div className="bg-white shadow rounded-lg p-4">
                {filterConfig.length > 0 && (
                    <button
                        className="flex items-center gap-2 text-gray-700 hover:text-black"
                        onClick={() => setOpen(!open)}
                    >
                        <FaFilter size={20} />
                        <span className="text-sm">Filter</span>
                    </button>
                )}
            {filterConfig.length > 0 && (
                <div className={`mt-4 border-t border-gray-300 pt-4 ${open ? 'block' : 'hidden'}`}>
                    <FilterField
                            filters={filterConfig}
                            setFilters={setColumnFilters}
                            onFilterChange={handleFilterChange}
                    />
                </div>
            )}
        </div>
    );
};

export default FilterBar;
