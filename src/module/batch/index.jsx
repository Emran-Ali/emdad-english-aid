'use client';
import Modal from '@/components/Modal';
import CreateBatch from '@/module/batch/CreateBatch';
import DataTable from '@emran/Components/ReactTable/DataTable';
import {processCellLimitedString} from '@emran/Components/ReactTable/tableHelper';
import useDataTableFetchData from '@emran/hooks/useFetchTableData';
import {useMemo, useState} from 'react';

export default function App() {
  const [modal, setModal] = useState(false);
  const onClose = () => {
    setModal(false);
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
        id: 'year',
        cell: (props) => props.row.original.year,
        enableColumnFilter: true,
        header: 'Year',
      },
      {
        id: 'batch_time',
        cell: (props) => props.row.original.batch_time,
        enableColumnFilter: true,
        header: 'Batch Time',
      },
      {
        id: 'batch_days_id',
        cell: (props) => props.row.original.batch_days_id,
        enableColumnFilter: true,
        header: 'Batch Days',
      },
      {
        id: 'students',
        cell: (props) => props.row.original.students,
        enableColumnFilter: true,
        header: 'Students',
      },

      {
        id: 'actions',
        enableColumnFilter: false,
        cell: (props) => {
          let data = props.row.original;
          return <button>{data.id}</button>;
        },
        header: 'Actions',
        enableHiding: false,
      },
    ],
    [],
  );

  const filterConfig = [
    {
      id: 'batch_name',
      label: 'Batch Name',
      type: 'select',
      options: [{id: 1, title: 'hello'}],
    },
    {
      id: 'batch_start_date',
      label: 'Batch Start Date',
      type: 'date',
    },
    {
      id: 'batch_end_date',
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
        <CreateBatch />
      </Modal>
    </div>
  );
}
