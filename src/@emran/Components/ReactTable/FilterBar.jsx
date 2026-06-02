import FilterField from '@emran/Components/ReactTable/FilterField';
import SearchComponent from '@emran/Components/ReactTable/SearchComponent'; // For collapsing behavior
import {useEffect, useState} from 'react';
import {IoFilter} from 'react-icons/io5';

const FilterBar = ({
  tableInstance,
  setGlobalFilter,
  resetColumnFilters,
  setColumnFilters,
  columnFilters,
  onRefreshCallback,
  filterConfig,
  onFetchData,
  showSearchComponent,
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
    <div className='bg-cyan-950/40 backdrop-blur-sm border border-cyan-800/50 rounded-xl p-4 mb-2'>
      <div className='flex justify-between items-center'>
        {showSearchComponent && (
          <SearchComponent setGlobalFilter={setGlobalFilter} />
        )}
        {filterConfig.length > 0 && (
          <button
            className='flex items-center gap-2 text-cyan-400 hover:text-white transition-colors'
            onClick={() => setOpen(!open)}>
            <IoFilter size={20} />
            <span className='text-sm font-medium'>Filter</span>
          </button>
        )}
      </div>
      {filterConfig.length > 0 && (
        <div
          className={`border-t border-cyan-800/50 mt-4 pt-4 ${
            open ? 'block' : 'hidden'
          }`}>
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
