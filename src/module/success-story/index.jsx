'use client';
import DataTable from '@emran/Components/ReactTable/DataTable';
import { processCellLimitedString } from '@emran/Components/ReactTable/tableHelper';
import useDataTableFetchData from '@emran/hooks/useFetchTableData';
import { useMemo, useState } from 'react';
import axios from 'axios';
import Modal from '@/components/Modal';
import { FaPlus, FaEye, FaEyeSlash, FaGraduationCap } from 'react-icons/fa';

export default function SuccessStoryModule() {
  const [modal, setModal] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    university: '',
    department: '',
    session: '',
    isShown: true,
  });

  const {
    onFetchData,
    data: StoryData,
    loading,
    pageCount,
    totalCount,
    mutate,
  } = useDataTableFetchData({ urlPath: 'api/success-story' });

  const handleToggleShow = async (id, currentStatus) => {
    try {
      await axios.put('/api/success-story', { id, isShown: !currentStatus });
      mutate();
    } catch (err) {
      console.error('Failed to update success story status', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/success-story', formData);
      setModal(false);
      mutate();
      setFormData({
        studentName: '',
        university: '',
        department: '',
        session: '',
        isShown: true,
      });
    } catch (err) {
      console.error('Failed to add success story', err);
    }
  };

  const columns = useMemo(
    () => [
      {
        id: 'studentName',
        header: 'Student Name',
        cell: (props) => <span className="font-bold text-cyan-200">{props.row.original.studentName}</span>,
      },
      {
        id: 'university',
        header: 'University',
        cell: processCellLimitedString('university'),
      },
      {
        id: 'department',
        header: 'Dept',
        cell: processCellLimitedString('department'),
      },
      {
        id: 'session',
        header: 'Session',
        cell: processCellLimitedString('session'),
      },
      {
        id: 'isShown',
        header: 'Status',
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
            >
              {isShown ? <FaEyeSlash /> : <FaEye />}
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
          <FaGraduationCap className="text-cyan-500" /> Success Stories
        </div>
        <button
          onClick={() => setModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-700 hover:bg-cyan-800 rounded-xl font-bold transition-all shadow-lg"
        >
          <FaPlus /> Add New Story
        </button>
      </div>

      <div className="bg-cyan-950/50 border border-cyan-800/50 rounded-2xl p-4 overflow-hidden">
        <DataTable
          columns={columns}
          tableData={StoryData}
          fetchData={onFetchData}
          loading={loading}
          pageCount={pageCount}
          totalCount={totalCount}
          onClickRefresh={mutate}
          enableCheckbox={false}
          showSearchComponent={true}
          showTopBar={true}
          tableTitle={'Success Stories Management'}
          enableRowNumbers={true}
        />
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Add Success Story">
        <form onSubmit={handleSubmit} className="space-y-4 p-4 text-white">
          <div>
            <label className="block text-sm font-medium mb-1">Student Name</label>
            <input
              type="text"
              className="w-full bg-cyan-900 border border-cyan-700 rounded-lg p-2"
              required
              value={formData.studentName}
              onChange={(e) => setFormData({...formData, studentName: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">University</label>
              <input
                type="text"
                className="w-full bg-cyan-900 border border-cyan-700 rounded-lg p-2"
                required
                value={formData.university}
                onChange={(e) => setFormData({...formData, university: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Department</label>
              <input
                type="text"
                className="w-full bg-cyan-900 border border-cyan-700 rounded-lg p-2"
                required
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Session (e.g., 2023-24)</label>
            <input
              type="text"
              className="w-full bg-cyan-900 border border-cyan-700 rounded-lg p-2"
              required
              value={formData.session}
              onChange={(e) => setFormData({...formData, session: e.target.value})}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 rounded-xl font-bold transition-all mt-4"
          >
            Save Success Story
          </button>
        </form>
      </Modal>
    </div>
  );
}
