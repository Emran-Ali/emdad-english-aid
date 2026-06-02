'use client';
import DataTable from '@emran/Components/ReactTable/DataTable';
import { processCellLimitedString } from '@emran/Components/ReactTable/tableHelper';
import useDataTableFetchData from '@emran/hooks/useFetchTableData';
import { useMemo, useState } from 'react';
import axios from 'axios';
import Modal from '@/components/Modal';
import { FaPlus, FaEye, FaEyeSlash, FaGraduationCap, FaEdit, FaTrash } from 'react-icons/fa';

export default function SuccessStoryModule() {
  const [modal, setModal] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
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
  } = useDataTableFetchData({ urlPath: '/api/success-story' });

  useMemo(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get('/api/user?per_page=-1&role=student');
        setStudents(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch students', err);
      }
    };
    fetchStudents();
  }, []);

  const handleToggleShow = async (id, currentStatus) => {
    try {
      await axios.put('/api/success-story', { id, isShown: !currentStatus });
      mutate();
    } catch (err) {
      console.error('Failed to update success story status', err);
    }
  };

  const handleStudentChange = (e) => {
    const studentId = e.target.value;
    const student = students.find(s => s.id === Number(studentId));
    if (student) {
      setFormData({
        ...formData,
        studentId,
        studentName: student.name,
      });
    } else {
      setFormData({
        ...formData,
        studentId: '',
        studentName: '',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        studentId: formData.studentId ? Number(formData.studentId) : null,
      };
      if (editingStory) {
        await axios.put('/api/success-story', { ...payload, id: editingStory.id });
      } else {
        await axios.post('/api/success-story', payload);
      }
      setModal(false);
      setEditingStory(null);
      mutate();
      setFormData({
        studentId: '',
        studentName: '',
        university: '',
        department: '',
        session: '',
        isShown: true,
      });
    } catch (err) {
      console.error('Failed to save success story', err);
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
            <div className="flex gap-2">
              <button
                onClick={() => handleToggleShow(id, isShown)}
                className={`p-2 rounded-lg transition-colors ${isShown ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-green-500/20 text-green-500 hover:bg-green-500/30'}`}
                title={isShown ? 'Hide' : 'Show'}
              >
                {isShown ? <FaEyeSlash /> : <FaEye />}
              </button>
              <button
                onClick={() => {
                  const data = props.row.original;
                  setEditingStory(data);
                  setFormData({
                    studentId: data.studentId?.toString() || '',
                    studentName: data.studentName,
                    university: data.university,
                    department: data.department,
                    session: data.session,
                    isShown: data.isShown,
                  });
                  setModal(true);
                }}
                className="p-2 bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 rounded-lg transition-colors"
                title="Edit"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(id)}
                className="p-2 bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded-lg transition-colors"
                title="Delete"
              >
                <FaTrash />
              </button>
            </div>
          );
        },
      },
    ],
    [handleToggleShow],
  );

  return (
    <div className='w-full'>
      <div className='flex justify-between text-white mb-6'>
        <div className='text-3xl font-bold flex items-center gap-2'>
          <FaGraduationCap className="text-cyan-500" /> Success Stories
        </div>
        <button
          onClick={() => {
            setEditingStory(null);
            setFormData({
              studentId: '',
              studentName: '',
              university: '',
              department: '',
              session: '',
              isShown: true,
            });
            setModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-700 hover:bg-cyan-800 rounded-xl font-bold transition-all shadow-lg"
        >
          <FaPlus /> Add New Story
        </button>
      </div>

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

      <Modal isOpen={modal} onClose={() => { setModal(false); setEditingStory(null); }} title={editingStory ? "Edit Success Story" : "Add Success Story"}>
        <form onSubmit={handleSubmit} className="space-y-4 p-4 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-cyan-300">Associate Student (Optional)</label>
              <select
                className="w-full bg-cyan-900/50 border border-cyan-700/50 rounded-lg p-2 text-cyan-100 focus:outline-none focus:border-cyan-500"
                value={formData.studentId}
                onChange={handleStudentChange}
              >
                <option value="" className="bg-cyan-950">Select Student</option>
                {students.map(s => (
                  <option key={s.id} value={s.id} className="bg-cyan-950">
                    {s.name} ({s.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-cyan-300">Student Name</label>
              <input
                type="text"
                className="w-full bg-cyan-900/50 border border-cyan-700/50 rounded-lg p-2 text-cyan-100 focus:outline-none focus:border-cyan-500"
                required
                value={formData.studentName}
                onChange={(e) => setFormData({...formData, studentName: e.target.value})}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-cyan-300">University</label>
              <input
                type="text"
                className="w-full bg-cyan-900/50 border border-cyan-700/50 rounded-lg p-2 text-cyan-100 focus:outline-none focus:border-cyan-500"
                required
                value={formData.university}
                onChange={(e) => setFormData({...formData, university: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-cyan-300">Department</label>
              <input
                type="text"
                className="w-full bg-cyan-900/50 border border-cyan-700/50 rounded-lg p-2 text-cyan-100 focus:outline-none focus:border-cyan-500"
                required
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-cyan-300">Session (e.g., 2023-24)</label>
            <input
              type="text"
              className="w-full bg-cyan-900/50 border border-cyan-700/50 rounded-lg p-2 text-cyan-100 focus:outline-none focus:border-cyan-500"
              required
              value={formData.session}
              onChange={(e) => setFormData({...formData, session: e.target.value})}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all mt-4 shadow-lg shadow-cyan-900/20"
          >
            Save Success Story
          </button>
        </form>
      </Modal>
    </div>
  );
}
