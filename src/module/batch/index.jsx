'use client';
import ActionMenu from '@/components/ActionMenu';
import Modal from '@/components/Modal';
import AssignStaff from '@/module/batch/AssignStaff';
import BatchSchedule from '@/module/batch/BatchSchedule';
import CreateBatch from '@/module/batch/CreateBatch';
import EditBatch from '@/module/batch/EditBatch';
import DataTable from '@emran/Components/ReactTable/DataTable';
import {processCellLimitedString} from '@emran/Components/ReactTable/tableHelper';
import useDataTableFetchData from '@emran/hooks/useFetchTableData';
import {useBatchService} from '@service/BatchService';
import {useMemo, useState} from 'react';
import {BiSolidShow} from 'react-icons/bi';
import {FaCalendar, FaEdit, FaPeople, FaTrash} from 'react-icons/fa';

export default function App() {
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [scheduleModal, setScheduleModal] = useState(false);
  const [assignStaffModal, setAssignStaffModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const {deleteBatchApi} = useBatchService();

  const onClose = () => {
    setModal(false);
  };

  const onEditClose = () => {
    setEditModal(false);
    setSelectedBatch(null);
  };

  const onScheduleClose = () => {
    setScheduleModal(false);
    setSelectedScheduleId(null);
  };

  const onAssignStaffClose = () => {
    setAssignStaffModal(false);
  };

  const {
    onFetchData,
    data: UserData,
    summary,
    loading,
    pageCount,
    totalCount,
    mutate,
  } = useDataTableFetchData({urlPath: 'api/batch'});

  const columns = useMemo(
    () => [
      {
        id: 'name',
        cell: processCellLimitedString('name'),
        enableColumnFilter: true,
        header: 'Batch Name',
      },
      {
        id: 'type',
        cell: (props) => props.row.original.type ?? 'N/A',
        enableColumnFilter: true,
        header: 'Batch Type',
      },
      {
        id: 'batchCode',
        cell: (props) => props.row.original.batchCode ?? 'N/A',
        enableColumnFilter: true,
        header: 'Batch Code',
      },
      {
        id: 'academicYear',
        cell: (props) => props.row.original.academicYear ?? 'N/A',
        enableColumnFilter: true,
        header: 'Academic Year',
      },
      {
        id: 'batchTime',
        cell: (props) => props.row.original.batchTime ?? 'N/A',
        enableColumnFilter: true,
        header: 'Batch Time',
      },
      {
        id: 'maxStudents',
        cell: (props) => props.row.original.maxStudents ?? 0,
        enableColumnFilter: true,
        header: 'Capacity',
      },
      {
        id: 'currentStudents',
        cell: (props) => props.row.original.currentStudents ?? 0,
        enableColumnFilter: true,
        header: 'Enrolled',
      },
      {
        id: 'fees',
        cell: (props) =>
          props.row.original.fees != null ? props.row.original.fees : '—',
        enableColumnFilter: false,
        header: 'Fees',
      },

      {
        id: 'actions',
        enableColumnFilter: false,
        cell: (props) => {
          let data = props.row.original;

          const actions = [
            {
              icon: BiSolidShow,
              label: 'View',
              onClick: () => {
                // View functionality - could open a detail modal
                console.log('View batch:', data.id);
              },
            },
            {
              icon: FaEdit,
              label: 'Edit',
              onClick: () => {
                setSelectedBatch(data);
                setEditModal(true);
              },
            },
            {
              icon: FaCalendar,
              label: 'Schedule',
              onClick: () => {
                setSelectedBatch(data);
                setScheduleModal(true);
              },
            },
            {
              icon: FaPeople,
              label: 'Assign Staff',
              onClick: () => {
                setSelectedBatch(data);
                setAssignStaffModal(true);
              },
            },
            {
              icon: FaTrash,
              label: 'Delete',
              onClick: () => handleDeleteBatch(data.id),
            },
          ];

          return <ActionMenu actions={actions} />;
        },
        header: 'Actions',
        enableHiding: false,
      },
    ],
    [editModal],
  );

  const handleDeleteBatch = async (id) => {
    if (confirm('Are you sure you want to delete this batch?')) {
      try {
        const res = await deleteBatchApi(`/api/batch?id=${id}`);
        if (res) {
          alert('Batch deleted successfully!');
          mutate();
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete batch');
      }
    }
  };

  const filterConfig = [
    {
      id: 'name',
      label: 'Batch Name',
      type: 'select',
      options: [{id: 1, title: 'hello'}],
    },
    {
      id: 'startDate',
      label: 'Batch Start Date',
      type: 'date',
    },
    {
      id: 'endDate',
      label: 'Batch End Date',
      type: 'date',
    },
  ];
  return (
    <div className='w-full'>
      <div className='flex justify-between text-white'>
        <div className='text-4xl font-bold'>Batch List</div>
        <button
          className='rounded-lg px-3 py-2 bg-cyan-700 cursor-pointer font-bold'
          onClick={() => {
            setModal(true);
          }}>
          Add New Batch
        </button>
      </div>
      <DataTable
        columns={columns}
        tableData={UserData}
        fetchData={onFetchData}
        serverSide={true}
        loading={loading}
        pageCount={pageCount}
        totalCount={totalCount}
        onClickRefresh={mutate}
        enableCheckbox={false}
        showTopBar={true}
        tableTitle={'Batch'}
        enableRowNumbers={true}
        filterConfig={filterConfig}
      />
      <Modal isOpen={modal} onClose={onClose} title={'Add New Batch'}>
        <CreateBatch onSuccess={mutate} onClose={onClose} />
      </Modal>
      <Modal isOpen={editModal} onClose={onEditClose} title={'Edit Batch'}>
        {selectedBatch && (
          <EditBatch
            batchData={selectedBatch}
            onSuccess={mutate}
            onClose={onEditClose}
          />
        )}
      </Modal>
      <BatchSchedule
        batchId={selectedBatch?.id}
        isOpen={scheduleModal}
        onClose={onScheduleClose}
        onSuccess={mutate}
      />
      <AssignStaff
        batchId={selectedBatch?.id}
        isOpen={assignStaffModal}
        onClose={onAssignStaffClose}
        onSuccess={mutate}
      />
    </div>
  );
}
