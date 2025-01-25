'use client'
import {useMemo, useState} from "react";
import Modal from "@/components/Modal";
import CreateUser from "@/module/user/CreateUser";
import DataTable from "@emran/Components/ReactTable/DataTable";
import {processCellLimitedString} from "@emran/Components/ReactTable/tableHelper";


const data = [
    // {head : 'New head 1', body: 'New Body 1'},
    // {head : 'New head 2', body: 'New Body 2'},
    // {head : 'New head 3', body: 'New Body 3'}
]
export default function User() {
    const [modal, setModal] = useState(false);
    const onClose = () => {
        setModal(false);
    }

    const columns = useMemo(
        () => [
            {
                id: 'head',
                cell: processCellLimitedString('head'),
                enableColumnFilter: true,
                header: 'Society',
            },
            {
                id: 'actions',
                enableColumnFilter: false,
                cell: (props) => {
                    let data = props.row.original;
                    return (
                        <button>{data.head}</button>
                    );
                },
                header: 'Actions',
                enableHiding: false,
            },
        ],
        [],
    );
    const filterConfig = [
        {
            id: 'committee_id',
            label: 'head',
            type: 'select',
            options: [{id:1, title:'hello'}],
        },
        {
            id: 'from_date',
            label: 'Date',
            type: 'date',
        },
    ];
    return (
        <div className="w-full">
            <div className="flex justify-between text-white">
                <div className="text-4xl font-bold">User List</div>
                <button className="rounded-lg px-3 py-2 bg-cyan-700 cursor-pointer font-bold" onClick={() => {
                    setModal(true)
                }} >Add New User</button>
            </div>
            <DataTable
                columns={columns}
                tableData={data}
                fetchData={()=> null}
                loading={false}
                pageCount={1}
                totalCount={1}
                onClickRefresh={()=>null}
                enableCheckbox={false}
                showTopBar={true}
                tableTitle={'User Table'}
                filterConfig={filterConfig}
            />
            <Modal isOpen={modal} onClose={onClose} title={'Add New User'} >
                <CreateUser />
            </Modal>
        </div>
    )
}