'use client';
import ActionMenu from '@/components/ActionMenu';
import Modal from '@/components/Modal';
import DataTable from '@emran/Components/ReactTable/DataTable';
import useDataTableFetchData from '@emran/hooks/useFetchTableData';
import { useMemo, useState, useEffect } from 'react';
import { BiMoney, BiArrowBack, BiUser } from 'react-icons/bi';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function BatchStudentModule({ batchId }) {
  const router = useRouter();
  const [batch, setBatch] = useState(null);
  const [paymentModal, setPaymentModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMethod: 'cash',
    remarks: '',
    markAsPaid: false,
    enrollmentId: ''
  });

  const {
    onFetchData,
    data: enrollmentData,
    loading,
    mutate,
  } = useDataTableFetchData({ urlPath: 'api/student-management', params: { batchId } });

  useEffect(() => {
    if (batchId) {
      axios.get(`/api/batch?id=${batchId}`).then(res => setBatch(res.data.data));
    }
  }, [batchId]);

  const handleCollectPayment = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/student-management', {
        ...paymentData,
        action: 'collect_payment'
      });
      setPaymentModal(false);
      mutate();
    } catch (err) {
      console.error('Failed to collect payment', err);
      alert('Failed to collect payment');
    }
  };

  const columns = useMemo(
    () => [
      {
        id: 'name',
        header: 'Student Name',
        cell: (props) => {
          const { enrollment, user, student } = props.row.original;
          return enrollment.studentName || user?.name || 'N/A';
        }
      },
      {
        id: 'contact',
        header: 'Contact',
        cell: (props) => {
          const { enrollment, user } = props.row.original;
          return enrollment.studentContact || user?.contactNumber || 'N/A';
        }
      },
      {
        id: 'totalAmount',
        header: 'Total Fees',
        cell: (props) => `৳${props.row.original.enrollment.totalAmount || 0}`
      },
      {
        id: 'paidAmount',
        header: 'Paid',
        cell: (props) => `৳${props.row.original.enrollment.paidAmount || 0}`
      },
      {
        id: 'dueAmount',
        header: 'Due',
        cell: (props) => {
          const { enrollment } = props.row.original;
          const due = (Number(enrollment.totalAmount || 0) - Number(enrollment.paidAmount || 0));
          return <span className={due > 0 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>৳{due}</span>;
        }
      },
      {
        id: 'paymentStatus',
        header: 'Status',
        cell: (props) => {
          const status = props.row.original.enrollment.paymentStatus;
          return (
            <span className={`px-2 py-1 rounded-full text-xs uppercase font-bold ${
              status === 'paid' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
              status === 'partial' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 
              'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {status || 'pending'}
            </span>
          );
        }
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (props) => {
          const data = props.row.original;
          const actions = [
            {
              icon: BiMoney,
              label: 'Collect Payment',
              onClick: () => {
                setSelectedEnrollment(data.enrollment);
                setPaymentData(prev => ({ ...prev, enrollmentId: data.enrollment.id, amount: (Number(data.enrollment.totalAmount || 0) - Number(data.enrollment.paidAmount || 0)) }));
                setPaymentModal(true);
              }
            }
          ];
          return <ActionMenu actions={actions} />;
        }
      }
    ],
    []
  );

  return (
    <div className='w-full space-y-4'>
      <div className='flex justify-between items-center text-white'>
        <div className='flex items-center gap-4'>
          <button 
            onClick={() => router.back()}
            className="p-2 bg-cyan-800/50 hover:bg-cyan-700 rounded-full transition-colors"
          >
            <BiArrowBack className="text-2xl" />
          </button>
          <div>
            <div className='text-3xl font-bold'>Batch Students</div>
            <div className="text-cyan-400 text-sm font-semibold">{batch?.name} ({batch?.batchCode})</div>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        tableData={enrollmentData}
        fetchData={onFetchData}
        serverSide={false} // API currently returns all for batchId, pagination not implemented for this specific call yet
        loading={loading}
        tableTitle={'Enrolled Students'}
        enableRowNumbers={true}
      />

      <Modal isOpen={paymentModal} onClose={() => setPaymentModal(false)} title={'Collect Payment'}>
        <form onSubmit={handleCollectPayment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-1">Amount</label>
            <input
              type="number"
              required
              className="w-full bg-cyan-900/50 border border-cyan-700/50 rounded-lg px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-500"
              value={paymentData.amount}
              onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-1">Payment Method</label>
            <select
              className="w-full bg-cyan-900/50 border border-cyan-700/50 rounded-lg px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-500"
              value={paymentData.paymentMethod}
              onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
            >
              <option value="cash">Cash</option>
              <option value="bkash">bKash</option>
              <option value="rocket">Rocket</option>
              <option value="nagad">Nagad</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-1">Remarks</label>
            <textarea
              className="w-full bg-cyan-900/50 border border-cyan-700/50 rounded-lg px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-500"
              value={paymentData.remarks}
              onChange={(e) => setPaymentData({ ...paymentData, remarks: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="markAsPaid"
              className="w-4 h-4 rounded border-cyan-700/50 bg-cyan-900/50 text-cyan-600 focus:ring-cyan-500"
              checked={paymentData.markAsPaid}
              onChange={(e) => setPaymentData({ ...paymentData, markAsPaid: e.target.checked })}
            />
            <label htmlFor="markAsPaid" className="text-sm text-cyan-300">Mark as fully paid</label>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setPaymentModal(false)}
              className="px-4 py-2 rounded-lg bg-gray-600/20 text-gray-300 hover:bg-gray-600/30 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-900/20"
            >
              Collect Payment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
