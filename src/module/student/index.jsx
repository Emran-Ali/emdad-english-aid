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

  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMethod: 'cash',
    remarks: '',
    markAsPaid: false,
    enrollmentId: ''
  });

  const fetchStudentDetails = async (userId) => {
    try {
      const res = await axios.get(`/api/student-management?userId=${userId}`);
      setStudentDetails(res.data.data);
    } catch (err) {
      console.error('Failed to fetch student details', err);
    }
  };

  const handleCollectPayment = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/student-management', {
        ...paymentData,
        action: 'collect_payment'
      });
      setPaymentModal(false);
      if (selectedStudent) fetchStudentDetails(selectedStudent.id);
      mutate();
    } catch (err) {
      console.error('Failed to collect payment', err);
    }
  };

  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({
    id: '',
    name: '',
    email: '',
    contactNumber: '',
    address: ''
  });

  const handleEditStudent = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/user', editData);
      setEditModal(false);
      mutate();
    } catch (err) {
      console.error('Failed to update student', err);
    }
  };

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
        id: 'actions',
        enableColumnFilter: false,
        cell: (props) => {
          let data = props.row.original;
          return (
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setSelectedStudent(data);
                  fetchStudentDetails(data.id);
                  setDetailsModal(true);
                }}
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                View
              </button>
              <button 
                onClick={() => {
                  setEditData({
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    contactNumber: data.contactNumber,
                    address: data.address
                  });
                  setEditModal(true);
                }}
                className="text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                Edit
              </button>
            </div>
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

      <Modal isOpen={detailsModal} onClose={() => setDetailsModal(false)} title={`Details: ${selectedStudent?.name}`}>
        <div className="p-4 text-cyan-100 space-y-6 overflow-y-auto max-h-[80vh]">
          <div className="grid grid-cols-2 gap-4 bg-cyan-900/30 p-4 rounded-xl border border-cyan-800/50">
            <div>
              <p className="text-cyan-400 text-xs uppercase tracking-wider font-semibold">Email</p>
              <p className="text-lg">{selectedStudent?.email}</p>
            </div>
            <div>
              <p className="text-cyan-400 text-xs uppercase tracking-wider font-semibold">Phone</p>
              <p className="text-lg">{selectedStudent?.contactNumber}</p>
            </div>
            <div className="col-span-2">
              <p className="text-cyan-400 text-xs uppercase tracking-wider font-semibold">Address</p>
              <p>{selectedStudent?.address}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-cyan-300">
              <span className="w-2 h-6 bg-cyan-500 rounded-full"></span>
              Enrolled Batches & Payments
            </h3>
            {studentDetails && studentDetails.length > 0 ? (
              <div className="space-y-4">
                {studentDetails.map((item) => (
                  <div key={item.enrollment.id} className="bg-cyan-950/50 border border-cyan-800/50 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-bold text-lg text-cyan-200">{item.batch?.name}</p>
                        <p className="text-sm text-cyan-400">{item.batch?.batchCode} | {item.batch?.academicYear}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-cyan-400 uppercase font-semibold">Status</p>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${item.enrollment.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {item.enrollment.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                      <div className="bg-cyan-900/20 p-2 rounded-lg">
                        <p className="text-[10px] text-cyan-500 uppercase font-bold">Total Fees</p>
                        <p className="font-bold">৳{item.enrollment.totalAmount}</p>
                      </div>
                      <div className="bg-green-900/10 p-2 rounded-lg">
                        <p className="text-[10px] text-green-500 uppercase font-bold">Paid</p>
                        <p className="font-bold text-green-400">৳{item.enrollment.paidAmount}</p>
                      </div>
                      <div className="bg-yellow-900/10 p-2 rounded-lg">
                        <p className="text-[10px] text-yellow-500 uppercase font-bold">Due</p>
                        <p className="font-bold text-yellow-400">৳{Number(item.enrollment.totalAmount) - Number(item.enrollment.paidAmount)}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        {item.enrollment.paymentStatus === 'paid' ? (
                          <span className="text-green-500 flex items-center gap-1 text-sm font-bold bg-green-500/10 px-3 py-1 rounded-full">
                            ✓ Fully Paid
                          </span>
                        ) : (
                          <button 
                            onClick={() => {
                              setPaymentData({
                                ...paymentData,
                                enrollmentId: item.enrollment.id,
                                amount: (Number(item.enrollment.totalAmount) - Number(item.enrollment.paidAmount)).toString()
                              });
                              setPaymentModal(true);
                            }}
                            className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs px-4 py-1.5 rounded-lg font-bold transition-all shadow-lg shadow-cyan-900/40"
                          >
                            Collect Payment
                          </button>
                        )}
                      </div>
                      <span className="text-xs text-cyan-500 italic">Enrollment Date: {new Date(item.enrollment.enrollmentDate).toLocaleDateString()}</span>
                    </div>

                    {item.payments && item.payments.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-cyan-800/30">
                        <p className="text-xs font-bold text-cyan-400 mb-2 uppercase">Payment History</p>
                        <div className="space-y-2">
                          {item.payments.map((p) => (
                            <div key={p.id} className="flex justify-between text-xs bg-cyan-900/10 p-2 rounded">
                              <span>{new Date(p.paidDate).toLocaleDateString()} - {p.paymentMethod}</span>
                              <span className="font-bold text-green-400">৳{p.amount}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-cyan-950/30 rounded-xl border border-dashed border-cyan-800/50 text-cyan-500">
                No active enrollments found for this student.
              </div>
            )}
          </div>
        </div>
      </Modal>

      <Modal isOpen={paymentModal} onClose={() => setPaymentModal(false)} title="Collect Payment">
        <form onSubmit={handleCollectPayment} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-1">Amount to Pay (৳)</label>
            <input 
              type="number" 
              className="w-full bg-cyan-900/50 border border-cyan-700/50 rounded-lg p-2 text-cyan-100 focus:outline-none focus:border-cyan-500"
              required
              value={paymentData.amount}
              onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-1">Payment Method</label>
              <select 
                className="w-full bg-cyan-900/50 border border-cyan-700/50 rounded-lg p-2 text-cyan-100 focus:outline-none focus:border-cyan-500"
                value={paymentData.paymentMethod}
                onChange={(e) => setPaymentData({...paymentData, paymentMethod: e.target.value})}
              >
                <option value="cash" className="bg-cyan-950">Cash</option>
                <option value="mobile_banking" className="bg-cyan-950">Mobile Banking (Bkash/Nagad)</option>
                <option value="bank_transfer" className="bg-cyan-950">Bank Transfer</option>
              </select>
            </div>
            <div className="flex items-center mt-6">
              <label className="flex items-center gap-2 cursor-pointer text-cyan-300">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded bg-cyan-900 border-cyan-700 text-cyan-600 focus:ring-cyan-500"
                  checked={paymentData.markAsPaid}
                  onChange={(e) => setPaymentData({...paymentData, markAsPaid: e.target.checked})}
                />
                <span className="text-sm font-bold">Mark as fully paid</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-1">Remarks</label>
            <input 
              type="text" 
              className="w-full bg-cyan-900/50 border border-cyan-700/50 rounded-lg p-2 text-cyan-100 focus:outline-none focus:border-cyan-500"
              placeholder="Optional notes..."
              value={paymentData.remarks}
              onChange={(e) => setPaymentData({...paymentData, remarks: e.target.value})}
            />
          </div>
          <button 
            type="submit"
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-cyan-900/20"
          >
            Confirm Payment
          </button>
        </form>
      </Modal>

      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Edit Student">
        <form onSubmit={handleEditStudent} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-1">Name</label>
              <input 
                type="text" 
                className="w-full bg-cyan-900/50 border border-cyan-700/50 rounded-lg p-2 text-cyan-100 focus:outline-none focus:border-cyan-500"
                required
                value={editData.name}
                onChange={(e) => setEditData({...editData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-1">Email</label>
              <input 
                type="email" 
                className="w-full bg-cyan-900/50 border border-cyan-700/50 rounded-lg p-2 text-cyan-100 focus:outline-none focus:border-cyan-500"
                required
                value={editData.email}
                onChange={(e) => setEditData({...editData, email: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-1">Contact Number</label>
            <input 
              type="text" 
              className="w-full bg-cyan-900/50 border border-cyan-700/50 rounded-lg p-2 text-cyan-100 focus:outline-none focus:border-cyan-500"
              required
              value={editData.contactNumber}
              onChange={(e) => setEditData({...editData, contactNumber: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-1">Address</label>
            <textarea 
              className="w-full bg-cyan-900/50 border border-cyan-700/50 rounded-lg p-2 text-cyan-100 focus:outline-none focus:border-cyan-500"
              rows={2}
              value={editData.address}
              onChange={(e) => setEditData({...editData, address: e.target.value})}
            />
          </div>
          <button 
            type="submit"
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-cyan-900/20"
          >
            Update Student
          </button>
        </form>
      </Modal>
    </div>
  );
}
