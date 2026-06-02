'use client';
import DataTable from '@emran/Components/ReactTable/DataTable';
import { processCellLimitedString } from '@emran/Components/ReactTable/tableHelper';
import useDataTableFetchData from '@emran/hooks/useFetchTableData';
import { useMemo, useState } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes, FaStar, FaPlus } from 'react-icons/fa';
import AddReview from './AddReview';

export default function ReviewsModule() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const {
    onFetchData,
    data: ReviewsData,
    loading,
    pageCount,
    totalCount,
    mutate,
  } = useDataTableFetchData({ urlPath: 'api/reviews' });

  const handleToggleShow = async (id, currentStatus) => {
    try {
      await axios.put('/api/reviews', { id, isShown: !currentStatus });
      mutate();
    } catch (err) {
      console.error('Failed to update review status', err);
    }
  };

  const columns = useMemo(
    () => [
      {
        id: 'reviewerName',
        cell: processCellLimitedString('reviewerName'),
        header: 'Reviewer',
      },
      {
        id: 'content',
        cell: (props) => <div className="max-w-xs truncate">{props.row.original.content}</div>,
        header: 'Comment',
      },
      {
        id: 'rating',
        cell: (props) => (
          <div className="flex items-center gap-1 text-yellow-500">
            {props.row.original.rating} <FaStar />
          </div>
        ),
        header: 'Rating',
      },
      {
        id: 'isShown',
        header: 'Display Status',
        cell: (props) => (
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${props.row.original.isShown ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
            {props.row.original.isShown ? 'Visible' : 'Hidden'}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (props) => {
          const { id, isShown } = props.row.original;
          return (
            <button
              onClick={() => handleToggleShow(id, isShown)}
              className={`p-2 rounded-lg transition-colors ${isShown ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-green-500/20 text-green-500 hover:bg-green-500/30'}`}
              title={isShown ? 'Hide from Landing' : 'Show on Landing'}
            >
              {isShown ? <FaTimes /> : <FaCheck />}
            </button>
          );
        },
      },
    ],
    [handleToggleShow],
  );

  return (
    <div className='w-full'>
      <div className='flex justify-between items-center text-white mb-6'>
        <div className='text-3xl font-bold'>Student Reviews</div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className='flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-cyan-900/20'
        >
          <FaPlus /> Add New Review
        </button>
      </div>
      <AddReview
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        mutate={mutate}
      />
        <DataTable
          columns={columns}
          tableData={ReviewsData}
          fetchData={onFetchData}
          loading={loading}
          pageCount={pageCount}
          totalCount={totalCount}
          onClickRefresh={mutate}
          enableCheckbox={false}
          showSearchComponent={true}
          showTopBar={true}
          tableTitle={'Reviews Management'}
          enableRowNumbers={true}
        />
    </div>
  );
}
