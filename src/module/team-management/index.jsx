'use client';
import DataTable from '@emran/Components/ReactTable/DataTable';
import { processCellLimitedString } from '@emran/Components/ReactTable/tableHelper';
import useDataTableFetchData from '@emran/hooks/useFetchTableData';
import { useMemo, useState } from 'react';
import axios from 'axios';
import Modal from '@/components/Modal';
import { FaPlus, FaUserTie, FaTrash } from 'react-icons/fa';

export default function TeamManagementModule() {
  const [modal, setModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    order: 0,
  });

  const {
    onFetchData,
    data: TeamData,
    loading,
    pageCount,
    totalCount,
    mutate,
  } = useDataTableFetchData({ urlPath: 'api/team' });

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;
    try {
      await axios.delete(`/api/team?id=${id}`);
      mutate();
    } catch (err) {
      console.error('Failed to delete team member', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/team', formData);
      setModal(false);
      mutate();
      setFormData({
        name: '',
        role: '',
        bio: '',
        order: 0,
      });
    } catch (err) {
      console.error('Failed to add team member', err);
    }
  };

  const columns = useMemo(
    () => [
      {
        id: 'name',
        header: 'Name',
        cell: (props) => <span className="font-bold text-cyan-200">{props.row.original.name}</span>,
      },
      {
        id: 'role',
        header: 'Role',
        cell: processCellLimitedString('role'),
      },
      {
        id: 'order',
        header: 'Display Order',
        cell: (props) => <span>{props.row.original.order}</span>,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (props) => {
          const { id } = props.row.original;
          return (
            <button
              onClick={() => handleDelete(id)}
              className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
            >
              <FaTrash />
            </button>
          );
        },
      },
    ],
    [mutate],
  );

  return (
    <div className='w-full'>
      <div className='flex justify-between text-white mb-6'>
        <div className='text-3xl font-bold flex items-center gap-2'>
          <FaUserTie className="text-cyan-500" /> Team Management
        </div>
        <button
          onClick={() => setModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-700 hover:bg-cyan-800 rounded-xl font-bold transition-all shadow-lg"
        >
          <FaPlus /> Add Member
        </button>
      </div>

      <div className="bg-cyan-950/50 border border-cyan-800/50 rounded-2xl p-4 overflow-hidden">
        <DataTable
          columns={columns}
          tableData={TeamData}
          fetchData={onFetchData}
          loading={loading}
          pageCount={pageCount}
          totalCount={totalCount}
          onClickRefresh={mutate}
          enableCheckbox={false}
          showSearchComponent={true}
          showTopBar={true}
          tableTitle={'Team Members'}
          enableRowNumbers={true}
        />
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Add Team Member">
        <form onSubmit={handleSubmit} className="space-y-4 p-4 text-white">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              className="w-full bg-cyan-900 border border-cyan-700 rounded-lg p-2"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role/Designation</label>
            <input
              type="text"
              className="w-full bg-cyan-900 border border-cyan-700 rounded-lg p-2"
              required
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              className="w-full bg-cyan-900 border border-cyan-700 rounded-lg p-2"
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Display Order</label>
            <input
              type="number"
              className="w-full bg-cyan-900 border border-cyan-700 rounded-lg p-2"
              value={formData.order}
              onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 rounded-xl font-bold transition-all mt-4"
          >
            Add to Team
          </button>
        </form>
      </Modal>
    </div>
  );
}
