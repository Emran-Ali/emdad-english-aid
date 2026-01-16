'use client';

import Modal from '@/components/Modal';
import {yupResolver} from '@hookform/resolvers/yup';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';

const scheduleSchema = yup.object({
  dayOfWeek: yup
    .string()
    .oneOf([
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ])
    .required('Day of week is required'),
  startTime: yup.string().required('Start time is required'),
  endTime: yup.string().required('End time is required'),
  room: yup.string().required('Room number is required'),
});

export default function BatchSchedule({
  batchId,
  scheduleId = null,
  isOpen,
  onClose,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors: formErrors},
  } = useForm({
    resolver: yupResolver(scheduleSchema),
    defaultValues: {
      dayOfWeek: 'Monday',
      startTime: '09:00',
      endTime: '10:00',
      room: '',
    },
  });

  useEffect(() => {
    if (scheduleId && isOpen) {
      fetchSchedule();
      setIsEdit(true);
    } else {
      setIsEdit(false);
      reset();
    }
  }, [scheduleId, isOpen]);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/batch/schedule', {
        params: {id: scheduleId},
      });

      if (response.data?.data) {
        const schedule = response.data.data;
        reset({
          dayOfWeek: schedule.dayOfWeek || 'Monday',
          startTime: schedule.startTime || '09:00',
          endTime: schedule.endTime || '10:00',
          room: schedule.room || '',
        });
      }
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      if (isEdit && scheduleId) {
        const payload = {
          id: scheduleId,
          ...data,
        };
        const response = await axios.put('/api/batch/schedule', payload);
        if (response.status === 200) {
          reset();
          onSuccess?.();
          onClose();
        }
      } else {
        const payload = {
          batchId: Number(batchId),
          ...data,
        };
        const response = await axios.post('/api/batch/schedule', payload);
        if (response.status === 201) {
          reset();
          onSuccess?.();
          onClose();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save schedule');
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
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className='w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-4'>
          {isEdit ? 'Edit Schedule' : 'Add Batch Schedule'}
        </h2>

        {error && (
          <div className='mb-4 p-3 bg-red-100 border border-red-400 rounded text-red-700'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-2'>
              Day of Week
            </label>
            <select
              {...register('dayOfWeek')}
              className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-cyan-700'
              disabled={loading}>
              <option value='Monday'>Monday</option>
              <option value='Tuesday'>Tuesday</option>
              <option value='Wednesday'>Wednesday</option>
              <option value='Thursday'>Thursday</option>
              <option value='Friday'>Friday</option>
              <option value='Saturday'>Saturday</option>
              <option value='Sunday'>Sunday</option>
            </select>
            {formErrors.dayOfWeek && (
              <p className='text-red-500 text-sm mt-1'>
                {formErrors.dayOfWeek.message}
              </p>
            )}
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Start Time
              </label>
              <input
                type='time'
                {...register('startTime')}
                className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-cyan-700'
                disabled={loading}
              />
              {formErrors.startTime && (
                <p className='text-red-500 text-sm mt-1'>
                  {formErrors.startTime.message}
                </p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium mb-2'>End Time</label>
              <input
                type='time'
                {...register('endTime')}
                className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-cyan-700'
                disabled={loading}
              />
              {formErrors.endTime && (
                <p className='text-red-500 text-sm mt-1'>
                  {formErrors.endTime.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>Room</label>
            <input
              type='text'
              placeholder='e.g., Room 101'
              {...register('room')}
              className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-cyan-700'
              disabled={loading}
            />
            {formErrors.room && (
              <p className='text-red-500 text-sm mt-1'>
                {formErrors.room.message}
              </p>
            )}
          </div>

          <div className='flex gap-3 pt-4'>
            <button
              type='button'
              onClick={handleClose}
              disabled={loading}
              className='flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded font-medium hover:bg-gray-400 disabled:opacity-50'>
              Cancel
            </button>
            <button
              type='submit'
              disabled={loading}
              className='flex-1 px-4 py-2 bg-cyan-700 text-white rounded font-medium hover:bg-cyan-800 disabled:opacity-50'>
              {loading
                ? isEdit
                  ? 'Updating...'
                  : 'Creating...'
                : isEdit
                ? 'Update'
                : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
