'use client';
import Modal from '@/components/Modal';
import CreateUser from '@/module/user/CreateUser';
import DataTable from '@emran/Components/ReactTable/DataTable';
import {processCellLimitedString} from '@emran/Components/ReactTable/tableHelper';
import useDataTableFetchData from '@emran/hooks/useFetchTableData';
import {useMemo, useState} from 'react';

export default function User() {
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
  } = useDataTableFetchData({urlPath: 'api/user'});

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
      id: 'type',
      label: 'Type',
      type: 'select',
      options: [{id: 1, title: 'hello'}],
    },
    {
      id: 'from_date',
      label: 'Date',
      type: 'date',
    },
  ];

  return (
    <div className='w-full'>
      <div className='flex justify-between text-white'>
        <div className='text-4xl font-bold'>User List</div>
        <button
          className='rounded-lg px-3 py-2 bg-cyan-700 cursor-pointer font-bold'
          onClick={() => {
            setModal(true);
          }}>
          Add New User
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
        showSearchComponent={true}
        showTopBar={true}
        tableTitle={'User Table'}
        enableRowNumbers={true}
        filterConfig={filterConfig}
      />
      <Modal isOpen={modal} onClose={onClose} title={'Add New User'}>
        <CreateUser />
      </Modal>
    </div>
  );
}
