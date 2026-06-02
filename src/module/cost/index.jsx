'use client';
import DataTable from '@emran/Components/ReactTable/DataTable';
import useDataTableFetchData from '@emran/hooks/useFetchTableData';
import { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '@/components/Modal';
import { FaPlus, FaMoneyBillWave } from 'react-icons/fa';

export default function CostModule() {
  const [modal, setModal] = useState(false);
  const [batches, setBatches] = useState([]);
  const [formData, setFormData] = useState({
    expenseType: 'other',
    description: '',
    amount: '',
    expenseDate: new Date().toISOString().split('T')[0],
    batchId: '',
  });

  const {
    onFetchData,
    data: CostData,
    loading,
    pageCount,
    totalCount,
    mutate,
  } = useDataTableFetchData({ urlPath: 'api/cost' });

  useEffect(() => {
    axios.get('/api/batch/dropdown').then(res => setBatches(res.data.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/cost', {
        ...formData,
        amount: Number(formData.amount),
        batchId: formData.batchId ? Number(formData.batchId) : null
      });
      setModal(false);
      mutate();
      setFormData({
        expenseType: 'other',
        description: '',
        amount: '',
        expenseDate: new Date().toISOString().split('T')[0],
        batchId: '',
      });
    } catch (err) {
      console.error('Failed to add cost', err);
    }
  };

  const columns = useMemo(
    () => [
      {
        id: 'expenseDate',
        header: 'Date',
        cell: (props) => <span>{new Date(props.row.original.expenseDate).toLocaleDateString()}</span>,
      },
      {
        id: 'expenseType',
        header: 'Type',
        cell: (props) => <span className="capitalize">{props.row.original.expenseType}</span>,
      },
      {
        id: 'description',
        header: 'Description',
        cell: (props) => <div className="max-w-xs truncate">{props.row.original.description}</div>,
      },
      {
        id: 'amount',
        header: 'Amount',
        cell: (props) => <span className="font-bold text-green-400">{props.row.original.amount} BDT</span>,
      },
    ],
    [],
  );

  return (
    <div className='w-full'>
      <div className='flex justify-between text-white mb-6'>
        <div className='text-3xl font-bold'>Batch Costs & Expenses</div>
        <button
          onClick={() => setModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-700 hover:bg-cyan-800 rounded-xl font-bold transition-all shadow-lg"
        >
          <FaPlus /> Add New Cost
        </button>
      </div>

        <DataTable
          columns={columns}
          tableData={CostData}
          fetchData={onFetchData}
          loading={loading}
          pageCount={pageCount}
          totalCount={totalCount}
          onClickRefresh={mutate}
          enableCheckbox={false}
          showSearchComponent={true}
          showTopBar={true}
          tableTitle={'Expenses Tracking'}
          enableRowNumbers={true}
        />

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Add New Expense">
        <form onSubmit={handleSubmit} className="space-y-4 p-2">
          <div>
            <label className="block text-sm font-medium mb-1 text-cyan-300">Expense Type</label>
            <select
              className="w-full bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg p-2 focus:outline-none focus:border-cyan-500 transition-colors"
              value={formData.expenseType}
              onChange={(e) => setFormData({...formData, expenseType: e.target.value})}
            >
              <option value="salary" className="bg-cyan-950">Salary</option>
              <option value="rent" className="bg-cyan-950">Rent</option>
              <option value="utilities" className="bg-cyan-950">Utilities</option>
              <option value="materials" className="bg-cyan-950">Materials</option>
              <option value="other" className="bg-cyan-950">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-cyan-300">Related Batch (Optional)</label>
            <select
              className="w-full bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg p-2 focus:outline-none focus:border-cyan-500 transition-colors"
              value={formData.batchId}
              onChange={(e) => setFormData({...formData, batchId: e.target.value})}
            >
              <option value="" className="bg-cyan-950">None</option>
              {batches.map(b => (
                <option key={b.id} value={b.id} className="bg-cyan-950">{b.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-cyan-300">Description</label>
            <textarea
              className="w-full bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg p-2 h-20 focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-cyan-600/50"
              required
              placeholder="Enter reason for expense"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-cyan-300">Amount</label>
              <input
                type="number"
                className="w-full bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg p-2 focus:outline-none focus:border-cyan-500 transition-colors"
                required
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-cyan-300">Date</label>
              <input
                type="date"
                className="w-full bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg p-2 focus:outline-none focus:border-cyan-500 transition-colors"
                required
                value={formData.expenseDate}
                onChange={(e) => setFormData({...formData, expenseDate: e.target.value})}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold transition-all mt-4 text-white shadow-lg shadow-cyan-900/20"
          >
            Submit Expense
          </button>
        </form>
      </Modal>
    </div>
  );
}
