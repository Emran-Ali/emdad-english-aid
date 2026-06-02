'use client';
import DataTable from '@emran/Components/ReactTable/DataTable';
import useDataTableFetchData from '@emran/hooks/useFetchTableData';
import { useMemo } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaPlus, FaEdit } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useState } from 'react';
import AddBooking from './AddBooking';

export default function BookingModule() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
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
      toast.success(`Booking status updated to ${status}`);
      mutate();
    } catch (err) {
      console.error('Failed to update booking status', err);
      toast.error('Failed to update booking status');
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
              <button
                onClick={() => {
                  setEditingBooking(props.row.original);
                  setIsAddModalOpen(true);
                }}
                className="p-2 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 rounded-lg transition-colors"
                title="Edit Booking"
              >
                <FaEdit />
              </button>
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
    [handleUpdateStatus],
  );

  return (
    <div className='w-full'>
      <div className='flex justify-between items-center text-white mb-6'>
        <div className='text-3xl font-bold'>Batch Bookings</div>
        <button
          onClick={() => {
            setEditingBooking(null);
            setIsAddModalOpen(true);
          }}
          className='flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-cyan-900/20'
        >
          <FaPlus /> Add New Booking
        </button>
      </div>
      <AddBooking
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingBooking(null);
        }}
        mutate={mutate}
        initialData={editingBooking}
      />
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
  );
}
