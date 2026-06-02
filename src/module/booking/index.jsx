'use client';
import DataTable from '@emran/Components/ReactTable/DataTable';
import useDataTableFetchData from '@emran/hooks/useFetchTableData';
import { useMemo } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaHourglassHalf, FaTimesCircle } from 'react-icons/fa';

export default function BookingModule() {
  const {
    onFetchData,
    data: BookingData,
    loading,
    pageCount,
    totalCount,
    mutate,
  } = useDataTableFetchData({ urlPath: 'api/booking' });

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put('/api/booking', { id, status });
      mutate();
    } catch (err) {
      console.error('Failed to update booking status', err);
    }
  };

  const columns = useMemo(
    () => [
      {
        id: 'studentName',
        header: 'Student Name',
        cell: (props) => <span className="font-semibold text-cyan-100">{props.row.original.studentName}</span>,
      },
      {
        id: 'contactNumber',
        header: 'Contact',
        cell: (props) => <span>{props.row.original.contactNumber}</span>,
      },
      {
        id: 'studentEmail',
        header: 'Email',
        cell: (props) => <span className="text-gray-400">{props.row.original.studentEmail}</span>,
      },
      {
        id: 'status',
        header: 'Status',
        cell: (props) => {
          const status = props.row.original.status;
          const colors = {
            pending: 'bg-yellow-500/20 text-yellow-500',
            confirmed: 'bg-green-500/20 text-green-500',
            cancelled: 'bg-red-500/20 text-red-500',
          };
          return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${colors[status] || colors.pending}`}>
              {status}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (props) => {
          const { id, status } = props.row.original;
          return (
            <div className="flex gap-2">
              {status !== 'confirmed' && (
                <button
                  onClick={() => handleUpdateStatus(id, 'confirmed')}
                  className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-lg transition-colors"
                  title="Confirm Booking"
                >
                  <FaCheckCircle />
                </button>
              )}
              {status !== 'cancelled' && (
                <button
                  onClick={() => handleUpdateStatus(id, 'cancelled')}
                  className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                  title="Cancel Booking"
                >
                  <FaTimesCircle />
                </button>
              )}
            </div>
          );
        },
      },
    ],
    [mutate],
  );

  return (
    <div className='w-full'>
      <div className='flex justify-between text-white mb-6'>
        <div className='text-3xl font-bold'>Batch Bookings</div>
      </div>
      <div className="bg-cyan-950/50 border border-cyan-800/50 rounded-2xl p-4 overflow-hidden shadow-xl">
        <DataTable
          columns={columns}
          tableData={BookingData}
          fetchData={onFetchData}
          loading={loading}
          pageCount={pageCount}
          totalCount={totalCount}
          onClickRefresh={mutate}
          enableCheckbox={false}
          showSearchComponent={true}
          showTopBar={true}
          tableTitle={'Bookings Management'}
          enableRowNumbers={true}
        />
      </div>
    </div>
  );
}
