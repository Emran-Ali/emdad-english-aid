'use client';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '@/components/Modal';

export default function AddBooking({ isOpen, onClose, mutate, initialData }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      status: 'confirmed',
      batchId: '',
      studentName: '',
      studentEmail: '',
      contactNumber: '',
      createUser: false
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        batchId: initialData.batchId.toString()
      });
    } else {
      reset({
        status: 'confirmed',
        batchId: '',
        studentName: '',
        studentEmail: '',
        contactNumber: '',
        createUser: false
      });
    }
  }, [initialData, reset]);

  const [loading, setLoading] = useState(false);
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const fetchBatches = async () => {
        try {
          const response = await axios.get('/api/batch');
          setBatches(response.data.data || []);
        } catch (error) {
          console.error('Failed to fetch batches:', error);
        }
      };
      fetchBatches();
    }
  }, [isOpen]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const payload = {
        batchId: Number(data.batchId),
        studentName: data.studentName,
        studentEmail: data.studentEmail,
        contactNumber: data.contactNumber,
        status: data.status,
        createUser: data.createUser
      };

      if (initialData) {
        await axios.put('/api/booking', {
          ...payload,
          id: initialData.id,
        });
      } else {
        await axios.post('/api/booking', payload);
      }
      reset();
      mutate();
      onClose();
    } catch (error) {
      console.error('Failed to save booking:', error);
      alert('Failed to save booking: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Booking" : "Add New Booking"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-1">Select Batch</label>
          <select
            {...register('batchId', { required: 'Batch is required' })}
            className="w-full p-2 bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg focus:outline-none focus:border-cyan-500"
          >
            <option value="" className="bg-cyan-950">Select a batch</option>
            {batches.map(batch => (
              <option key={batch.id} value={batch.id} className="bg-cyan-950">
                {batch.name} ({batch.batchCode})
              </option>
            ))}
          </select>
          {errors.batchId && <p className="text-red-500 text-xs mt-1">{errors.batchId.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-1">Student Name</label>
          <input
            {...register('studentName', { required: 'Name is required' })}
            className="w-full p-2 bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg focus:outline-none focus:border-cyan-500"
            placeholder="John Doe"
          />
          {errors.studentName && <p className="text-red-500 text-xs mt-1">{errors.studentName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-1">Student Email</label>
          <input
            type="email"
            {...register('studentEmail', { required: 'Email is required' })}
            className="w-full p-2 bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg focus:outline-none focus:border-cyan-500"
            placeholder="john@example.com"
          />
          {errors.studentEmail && <p className="text-red-500 text-xs mt-1">{errors.studentEmail.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-1">Contact Number</label>
          <input
            {...register('contactNumber', { required: 'Contact number is required' })}
            className="w-full p-2 bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg focus:outline-none focus:border-cyan-500"
            placeholder="017XXXXXXXX"
          />
          {errors.contactNumber && <p className="text-red-500 text-xs mt-1">{errors.contactNumber.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-1">Status</label>
          <select
            {...register('status')}
            className="w-full p-2 bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg focus:outline-none focus:border-cyan-500"
          >
            <option value="pending" className="bg-cyan-950">Pending</option>
            <option value="confirmed" className="bg-cyan-950">Confirmed</option>
            <option value="cancelled" className="bg-cyan-950">Cancelled</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register('createUser')}
            id="createUser"
            className="w-4 h-4 bg-cyan-900/50 border-cyan-700/50 rounded"
          />
          <label htmlFor="createUser" className="text-sm font-medium text-cyan-300">Create user account (without password)</label>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-600/20 text-gray-400 border border-gray-600/50 rounded-lg hover:bg-gray-600 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 font-bold transition-all shadow-lg shadow-cyan-900/20 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Booking'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
