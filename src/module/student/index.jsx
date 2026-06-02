'use client';
import Modal from '@/components/Modal';
import CreateUser from '@/module/user/CreateUser';
import DataTable from '@emran/Components/ReactTable/DataTable';
import {processCellLimitedString} from '@emran/Components/ReactTable/tableHelper';
import useDataTableFetchData from '@emran/hooks/useFetchTableData';
import {useMemo, useState, useEffect} from 'react';
import axios from 'axios';

export default function Student() {
  const [modal, setModal] = useState(false);
  const [batchOptions, setBatchOptions] = useState([]);
  
  const onClose = () => {
    setModal(false);
  };

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await axios.get('/api/batch/dropdown');
        setBatchOptions(res.data?.data || []);
      } catch (err) {
        console.error('Failed to fetch batch dropdown', err);
      }
    };
    fetchBatches();
  }, []);

  const {
    onFetchData,
    data: StudentData,
    summary,
    loading,
    pageCount,
    totalCount,
    mutate,
  } = useDataTableFetchData({urlPath: 'api/user', params: {role: 'student'}});

  const columns = useMemo(
    () => [
      {
        id: 'name',
        cell: processCellLimitedString('name'),
        enableColumnFilter: true,
        header: 'Name',
      },
      {
        id: 'email',
        cell: processCellLimitedString('email'),
        enableColumnFilter: true,
        header: 'Email',
      },
      {
        id: 'contactNumber',
        cell: processCellLimitedString('contactNumber'),
        enableColumnFilter: true,
        header: 'Phone Number',
      },
      {
        id: 'address',
        cell: processCellLimitedString('address'),
        enableColumnFilter: true,
        header: 'Address',
      },
      {
        id: 'actions',
        enableColumnFilter: false,
        cell: (props) => {
          let data = props.row.original;
          return <button className="text-cyan-700 hover:underline">{data.id}</button>;
        },
        header: 'Actions',
        enableHiding: false,
      },
    ],
    [],
  );

  const filterConfig = [
    {
      id: 'batchId',
      label: 'By Batch',
      type: 'select',
      options: batchOptions,
    },
    {
      id: 'isActive',
      label: 'Status',
      type: 'select',
      options: [
        {id: 'true', title: 'Active'},
        {id: 'false', title: 'Inactive'},
      ],
    },
  ];

  return (
    <div className='w-full'>
      <div className='flex justify-between text-white mb-6'>
        <div className='text-4xl font-bold'>Student List</div>
        <button
          className='rounded-lg px-4 py-2 bg-cyan-700 hover:bg-cyan-800 cursor-pointer font-bold'
          onClick={() => {
            setModal(true);
          }}>
          Add New Student
        </button>
      </div>
      <DataTable
        columns={columns}
        tableData={StudentData}
        fetchData={onFetchData}
        loading={loading}
        pageCount={pageCount}
        totalCount={totalCount}
        onClickRefresh={mutate}
        enableCheckbox={false}
        showSearchComponent={true}
        showTopBar={true}
        tableTitle={'Student Table'}
        enableRowNumbers={true}
        filterConfig={filterConfig}
      />
      <Modal isOpen={modal} onClose={onClose} title={'Add New Student'}>
        <CreateUser role="student" onSuccess={() => { onClose(); mutate(); }} />
      </Modal>
    </div>
  );
}
