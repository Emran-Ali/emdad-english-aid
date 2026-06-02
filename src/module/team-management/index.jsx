'use client';
import DataTable from '@emran/Components/ReactTable/DataTable';
import { processCellLimitedString } from '@emran/Components/ReactTable/tableHelper';
import useDataTableFetchData from '@emran/hooks/useFetchTableData';
import { useMemo, useState } from 'react';
import axios from 'axios';
import Modal from '@/components/Modal';
import { FaPlus, FaUserTie, FaTrash, FaEdit } from 'react-icons/fa';

export default function TeamManagementModule() {
  const [modal, setModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    order: 0,
    contact: '',
    facebook: '',
    linkedin: '',
    github: '',
    twitter: '',
    instagram: '',
    userId: '',
  });

  const {
    onFetchData,
    data: TeamData,
    loading,
    pageCount,
    totalCount,
    mutate,
  } = useDataTableFetchData({ urlPath: '/api/team' });

  useMemo(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/api/user?per_page=-1');
        setUsers(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch users', err);
      }
    };
    fetchUsers();
  }, []);

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
      const payload = {
        ...formData,
        userId: formData.userId ? Number(formData.userId) : null,
      };
      if (editingMember) {
        await axios.put('/api/team', { ...payload, id: editingMember.id });
      } else {
        await axios.post('/api/team', payload);
      }
      setModal(false);
      setEditingMember(null);
      mutate();
      setFormData({
        name: '',
        role: '',
        bio: '',
        order: 0,
        contact: '',
        facebook: '',
        linkedin: '',
        github: '',
        twitter: '',
        instagram: '',
        userId: '',
      });
    } catch (err) {
      console.error('Failed to save team member', err);
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
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const data = props.row.original;
                  setEditingMember(data);
                  setFormData({
                    name: data.name,
                    role: data.role,
                    bio: data.bio || '',
                    order: data.order || 0,
                    contact: data.contact || '',
                    facebook: data.facebook || '',
                    linkedin: data.linkedin || '',
                    github: data.github || '',
                    twitter: data.twitter || '',
                    instagram: data.instagram || '',
                    userId: data.userId?.toString() || '',
                  });
                  setModal(true);
                }}
                className="p-2 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 rounded-lg transition-colors"
                title="Edit"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(id)}
                className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                title="Remove"
              >
                <FaTrash />
              </button>
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
        <div className='text-3xl font-bold flex items-center gap-2'>
          <FaUserTie className="text-cyan-500" /> Team Management
        </div>
        <button
          onClick={() => {
            setEditingMember(null);
            setFormData({
              name: '',
              role: '',
              bio: '',
              order: 0,
              contact: '',
              facebook: '',
              linkedin: '',
              github: '',
              twitter: '',
              instagram: '',
              userId: '',
            });
            setModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-700 hover:bg-cyan-800 rounded-xl font-bold transition-all shadow-lg"
        >
          <FaPlus /> Add Member
        </button>
      </div>

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

      <Modal isOpen={modal} onClose={() => { setModal(false); setEditingMember(null); }} title={editingMember ? "Edit Team Member" : "Add Team Member"}>
        <form onSubmit={handleSubmit} className="space-y-4 p-4 text-white overflow-y-auto max-h-[80vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-cyan-300">Full Name</label>
              <input
                type="text"
                className="w-full bg-cyan-900/50 border border-cyan-700/50 rounded-lg p-2 text-cyan-100 focus:outline-none focus:border-cyan-500"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-cyan-300">Role/Designation</label>
              <input
                type="text"
                className="w-full bg-cyan-900/50 border border-cyan-700/50 rounded-lg p-2 text-cyan-100 focus:outline-none focus:border-cyan-500"
                required
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-cyan-300">Contact Number</label>
              <input
                type="text"
                className="w-full bg-cyan-900/50 border border-cyan-700/50 rounded-lg p-2 text-cyan-100 focus:outline-none focus:border-cyan-500"
                value={formData.contact}
                onChange={(e) => setFormData({...formData, contact: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-cyan-300">Associate User</label>
              <select
                className="w-full bg-cyan-900/50 border border-cyan-700/50 rounded-lg p-2 text-cyan-100 focus:outline-none focus:border-cyan-500"
                value={formData.userId}
                onChange={(e) => setFormData({...formData, userId: e.target.value})}
              >
                <option value="" className="bg-cyan-950">Select User</option>
                {users.map(u => (
                  <option key={u.id} value={u.id} className="bg-cyan-950">
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-cyan-300">Facebook Profile</label>
              <input
                type="url"
                className="w-full bg-cyan-900/50 border border-cyan-700/50 rounded-lg p-2 text-cyan-100 focus:outline-none focus:border-cyan-500"
                value={formData.facebook}
                onChange={(e) => setFormData({...formData, facebook: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-cyan-300">LinkedIn Profile</label>
              <input
                type="url"
                className="w-full bg-cyan-900/50 border border-cyan-700/50 rounded-lg p-2 text-cyan-100 focus:outline-none focus:border-cyan-500"
                value={formData.linkedin}
                onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-cyan-300">GitHub</label>
              <input
                type="url"
                className="w-full bg-cyan-900/50 border border-cyan-700/50 rounded-lg p-2 text-cyan-100 focus:outline-none focus:border-cyan-500"
                value={formData.github}
                onChange={(e) => setFormData({...formData, github: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-cyan-300">Twitter</label>
              <input
                type="url"
                className="w-full bg-cyan-900/50 border border-cyan-700/50 rounded-lg p-2 text-cyan-100 focus:outline-none focus:border-cyan-500"
                value={formData.twitter}
                onChange={(e) => setFormData({...formData, twitter: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-cyan-300">Instagram</label>
              <input
                type="url"
                className="w-full bg-cyan-900/50 border border-cyan-700/50 rounded-lg p-2 text-cyan-100 focus:outline-none focus:border-cyan-500"
                value={formData.instagram}
                onChange={(e) => setFormData({...formData, instagram: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-cyan-300">Bio</label>
            <textarea
              className="w-full bg-cyan-900/50 border border-cyan-700/50 rounded-lg p-2 text-cyan-100 focus:outline-none focus:border-cyan-500"
              rows={2}
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-cyan-300">Display Order</label>
            <input
              type="number"
              className="w-full bg-cyan-900/50 border border-cyan-700/50 rounded-lg p-2 text-cyan-100 focus:outline-none focus:border-cyan-500"
              value={formData.order}
              onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all mt-4 shadow-lg shadow-cyan-900/20"
          >
            {editingMember ? 'Update Member' : 'Add to Team'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
