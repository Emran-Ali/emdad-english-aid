// components/DataTable/DataTable.jsx
import FilterBar from '@emran/Components/ReactTable/FilterBar';
import {flexRender, useReactTable} from '@tanstack/react-table';
import {useEffect, useState} from 'react';
import {IoArrowDownOutline, IoArrowUpOutline} from 'react-icons/io5';
import {NoDataFound} from './TableElements';
import {getTableOptions} from './tableHelper';

const DataTable = ({
  columns,
  tableData: data,
  fetchData,
  loading,
  paginate = true,
  toggleResetTable = false,
  handleRowSelectionData,
  totalCount,
  pageCount: controlledPageCount,
  showTopBar = true,
  onClickRefresh,
  enableRowNumbers = true,
  hiddenColumns = [],
  showSearchComponent = true,
  tableTitle,
  enableCheckbox = false,
  filterConfig = [],
}) => {
  // States
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnVisibility, setColumnVisibility] = useState(
    hiddenColumns.reduce((acc, col) => ({...acc, [col]: false}), {}),
  );
  const [datatableData, setDatatableData] = useState(() => data || []);
  const [datatableColumns, setDatatableColumns] = useState(() => columns);

  const isServerSideTable = typeof fetchData !== 'undefined';
  // Table instance
  const table = useReactTable(
    getTableOptions({
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
    }),
  );

  let {resetColumnFilters, getPageCount, previousPage} = table;
  let {pageIndex, pageSize} = table.getState().pagination;
  const sorting = table.getState().sorting;

  useEffect(() => {
    if (!loading) {
      setDatatableData(data);
    }
  }, [data]);

  useEffect(() => {
    let updatedColumns = [...columns];
    let additionalColumns = [];

    if (enableCheckbox) {
      additionalColumns.push({
        id: 'select',
        header: ({table}) => (
          <input
            type='checkbox'
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({row}) => (
          <input
            type='checkbox'
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      });
    }

    if (enableRowNumbers && !loading && data.length) {
      additionalColumns.push({
        id: '#index',
        cell: (props) =>
          props.row.index + (pageIndex ? pageIndex * pageSize + 1 : 1),
        header: 'S/N',
        enableHiding: false,
      });
    }

    setDatatableColumns([...additionalColumns, ...updatedColumns]);
  }, [
    columns,
    loading,
    enableRowNumbers,
    enableCheckbox,
    data,
    pageIndex,
    pageSize,
  ]);

  useEffect(() => {
    if (
      table &&
      isServerSideTable &&
      getPageCount == 0 &&
      !loading &&
      pageIndex != 0
    ) {
      previousPage();
    }
  }, [table.getPageCount, loading, pageIndex, toggleResetTable]);

  useEffect(() => {
    let selectedIds = Object.keys(rowSelection);
    let items = [...datatableData];
    const selectedData = items.filter((item, number) =>
      selectedIds.includes(String(number)),
    );
    if (handleRowSelectionData) {
      handleRowSelectionData(selectedData);
    }
  }, [rowSelection, table]);

  useEffect(() => {
    if (columnFilters && columnFilters.length > 0) {
      pageIndex = 0;
      table.setPageIndex(0);
    }
  }, [columnFilters]);

  useEffect(() => {
    if (isServerSideTable) {
      fetchData({
        table,
        pageIndex,
        pageSize,
        sorting,
        search: globalFilter,
        filters: columnFilters,
        toggleRefresh: toggleResetTable,
      });
    }
  }, [
    pageIndex,
    pageSize,
    sorting,
    toggleResetTable,
    columnFilters,
    globalFilter,
  ]);

  useEffect(() => {
    if (!paginate) {
      table.setPageSize(datatableData.length);
      table.setPageIndex(0);
    }
  }, [datatableData]);

  const handleChangePage = (event, newPage) => {
    table.setPageIndex(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    table.setPageSize(parseInt(event.target.value));
    table.setPageIndex(0);
  };

  // Table header component
  const TableHeader = () => (
    <thead className='bg-cyan-600 text-white'>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              className='px-6 py-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer'
              onClick={header.column.getToggleSortingHandler()}>
              <div className='flex items-center'>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
                {header.column.getIsSorted() && (
                  <span className='ml-2'>
                    {header.column.getIsSorted() === 'asc' ? (
                      <IoArrowUpOutline className='h-4 w-4' />
                    ) : (
                      <IoArrowDownOutline className='h-4 w-4' />
                    )}
                  </span>
                )}
              </div>
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );

  // Table body component
  const TableBody = () => (
    <tbody className='bg-gray-100 text-black divide-y divide-gray-200'>
      {table.getRowModel().rows.map((row) => (
        <tr key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <td key={cell.id} className='px-6 py-4 whitespace-nowrap text-sm'>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  // Pagination component
  const Pagination = () => (
    <div className='flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6'>
      <div className='flex items-center'>
        <span className='text-sm text-gray-700'>
          Showing
          <select
            value={pageSize}
            onChange={handleChangeRowsPerPage}
            className='mx-2 p-2 border-cyan-600 rounded-md'>
            {[5, 10, 20].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          entries
        </span>
        <span className='text-sm text-gray-700 ml-10'>
          Total {totalCount} {tableTitle}
        </span>
      </div>

      <div className='flex items-center space-x-2'>
        <button
          onClick={() => table.setPageIndex((old) => Math.max(old - 1, 0))}
          disabled={pageIndex === 0}
          className='px-3 bg-gray-100 text-black py-1 border rounded-md disabled:opacity-50
          disabled:cursor-not-allowed'>
          Prev
        </button>
        <span className='text-sm text-black'>
          Page {pageIndex + 1} of {Math.ceil(totalCount / pageSize)}
        </span>
        <button
          onClick={() => table.setPageIndex((old) => old + 1)}
          disabled={pageIndex >= Math.ceil(totalCount / pageSize) - 1}
          className='px-3 py-1 bg-gray-100 text-black border rounded-md disabled:opacity-50 disabled:cursor-not-allowed'>
          Next
        </button>
      </div>
    </div>
  );

  return (
    <div className='flex flex-col'>
      <div className='mt-4 bg-white rounded-lg shadow'>
        <div className='p-6'>
          {showTopBar && (
            <FilterBar
              tableInstance={table}
              setGlobalFilter={setGlobalFilter}
              resetColumnFilters={() => setColumnFilters([])}
              setColumnFilters={setColumnFilters}
              columnFilters={columnFilters}
              onRefreshCallback={onClickRefresh}
              filterConfig={filterConfig}
              onFetchData={fetchData}
              showSearchComponent={showSearchComponent}
            />
          )}

          <div className='overflow-x-auto border-2 border-cyan-600 rounded-lg'>
            <table className='min-w-full divide-y divide-gray-200'>
              <TableHeader />
              {datatableData?.length > 0 && <TableBody />}
            </table>

            {datatableData?.length === 0 && !loading && <NoDataFound />}

            {loading && (
              <div className='flex items-center justify-center p-4'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
              </div>
            )}
          </div>

          {paginate && datatableData?.length > 0 && <Pagination />}
        </div>
      </div>
    </div>
  );
};

export default DataTable;
