'use client';

import Modal from '@/components/Modal';
import {yupResolver} from '@hookform/resolvers/yup';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';

const assignmentSchema = yup.object({
  staffId: yup.number().required('Staff member is required'),
  role: yup
    .string()
    .oneOf(['instructor', 'coordinator', 'assistant'])
    .required('Role is required'),
});

export default function AssignStaff({batchId, isOpen, onClose, onSuccess}) {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors: formErrors},
  } = useForm({
    resolver: yupResolver(assignmentSchema),
    defaultValues: {
      staffId: '',
      role: 'instructor',
    },
  });

  useEffect(() => {
    fetchStaffUsers();
  }, []);

  const fetchStaffUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/user', {
        params: {role: 'staff', per_page: -1},
      });
      setStaffList(response.data?.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load staff');
      setStaffList([]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const payload = {
        batchId: Number(batchId),
        staffId: Number(data.staffId),
        role: data.role,
        isActive: true,
      };

      const response = await axios.post('/api/batch/assignment', payload);

      if (response.status === 201) {
        reset();
        onSuccess?.();
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign staff');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Assign Staff to Batch" size="medium">
      <div className='w-full'>
        {error && (
          <div className='mb-4 p-3 bg-red-100 border border-red-400 rounded text-red-700'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-2 text-cyan-300'>
              Staff Member
            </label>
            <select
              {...register('staffId')}
              className='w-full px-3 py-2 bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors'
              disabled={loading}>
              <option value='' className='bg-cyan-950'>Select a staff member</option>
              {staffList.map((staff) => (
                <option key={staff.id} value={staff.id} className='bg-cyan-950'>
                  {staff.name} ({staff.email})
                </option>
              ))}
            </select>
            {formErrors.staffId && (
              <p className='text-red-500 text-sm mt-1'>
                {formErrors.staffId.message}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium mb-2 text-cyan-300'>Role</label>
            <select
              {...register('role')}
              className='w-full px-3 py-2 bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors'
              disabled={loading}>
              <option value='instructor' className='bg-cyan-950'>Instructor</option>
              <option value='coordinator' className='bg-cyan-950'>Coordinator</option>
              <option value='assistant' className='bg-cyan-950'>Assistant</option>
            </select>
            {formErrors.role && (
              <p className='text-red-500 text-sm mt-1'>
                {formErrors.role.message}
              </p>
            )}
          </div>

          <div className='flex gap-3 pt-4'>
            <button
              type='button'
              onClick={handleClose}
              disabled={loading}
              className='flex-1 px-4 py-2 bg-gray-600/20 text-gray-400 border border-gray-600/50 rounded-lg hover:bg-gray-600 hover:text-white transition-all duration-200'>
              Cancel
            </button>
            <button
              type='submit'
              disabled={loading}
              className='flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 font-bold transition-all shadow-lg shadow-cyan-900/20'>
              {loading ? 'Assigning...' : 'Assign Staff'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
