import {
    getCoreRowModel,
    getFacetedMinMaxValues,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
} from '@tanstack/react-table';
import {IndeterminateCheckbox} from './IndeterminateCheckbox';
import React from 'react';

export function getTableOptions({
                                    isServerSideTable,
                                    datatableData,
                                    datatableColumns,
                                    columnVisibility,
                                    columnFilters,
                                    globalFilter,
                                    rowSelection,
                                    setRowSelection,
                                    setColumnVisibility,
                                    setColumnFilters,
                                    setGlobalFilter,
                                    controlledPageCount,
                                }) {
    const serverSideOptions = {
        data: datatableData,
        columns: datatableColumns,
        filterFns: {},
        enableFilters: true,
        enableColumnFilters: true,
        state: {
            columnVisibility,
            columnFilters,
            globalFilter,
            rowSelection,
        },
        onRowSelectionChange: setRowSelection,
        onColumnVisibilityChange: setColumnVisibility,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: 'includesString',
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        debugTable: false,
        debugHeaders: false,
        debugColumns: false,
        manualPagination: true,
        manualFiltering: true,
        manualSorting: true,
        pageCount: controlledPageCount,
    };

    const clientSideOptions = {
        data: datatableData,
        columns: datatableColumns,
        filterFns: {},
        enableFilters: true,
        enableColumnFilters: true,
        state: {
            columnVisibility,
            columnFilters,
            globalFilter,
            rowSelection,
        },
        onRowSelectionChange: setRowSelection,
        onColumnVisibilityChange: setColumnVisibility,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: 'includesString',
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        debugTable: false,
        debugHeaders: false,
        debugColumns: false,
    };

    return isServerSideTable ? serverSideOptions : clientSideOptions;
}

export function dataTableEnableSelectableRow({row}) {
    return (
        <div className='px-1'>
            <IndeterminateCheckbox
                {...{
                    checked: row.getIsSelected(),
                    indeterminate: row.getIsSomeSelected(),
                    onChange: row.getToggleSelectedHandler(),
                }}
            />
        </div>
    );
}

export function dataTableEnableSelectableHeader({table}) {
    return (
        <IndeterminateCheckbox
            {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler(),
            }}
        />
    );
}

export const processCellLimitedString = (
    field,
    size = 50,
    delimiter = '...',
) => {
    return (props) => {
        return getLimitedString(
            props.row.original.hasOwnProperty(field) ? props.row.original[field] : '',
            size,
            delimiter,
        );
    };
};

export const getLimitedString = (
    str,
    size = 50,
    delimiter = '...',
) => {
    return !str || str.length < size ? str : str.substring(0, size) + delimiter;
};