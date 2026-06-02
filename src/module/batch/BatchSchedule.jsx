'use client';

import Modal from '@/components/Modal';
import {yupResolver} from '@hookform/resolvers/yup';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {useFieldArray, useForm} from 'react-hook-form';
import {FaPlus, FaTrash} from 'react-icons/fa';
import * as yup from 'yup';

const scheduleItemSchema = yup.object({
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

const scheduleSchema = yup.object({
  schedules: yup.array().of(scheduleItemSchema).min(1, 'At least one schedule is required'),
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
    control,
    formState: {errors: formErrors},
  } = useForm({
    resolver: yupResolver(scheduleSchema),
    defaultValues: {
      schedules: [
        {
          dayOfWeek: 'Monday',
          startTime: '09:00',
          endTime: '10:00',
          room: '',
        },
      ],
    },
  });

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'schedules',
  });

  useEffect(() => {
    if (scheduleId && isOpen) {
      fetchSchedule();
      setIsEdit(true);
    } else if (isOpen) {
      setIsEdit(false);
      reset({
        schedules: [
          {
            dayOfWeek: 'Monday',
            startTime: '09:00',
            endTime: '10:00',
            room: '',
          },
        ],
      });
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
          schedules: [
            {
              dayOfWeek: schedule.dayOfWeek || 'Monday',
              startTime: schedule.startTime || '09:00',
              endTime: schedule.endTime || '10:00',
              room: schedule.room || '',
            },
          ],
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
      setError(null);

      if (isEdit && scheduleId) {
        const payload = {
          id: scheduleId,
          batchId: Number(batchId),
          ...data.schedules[0],
        };
        const response = await axios.put('/api/batch/schedule', payload);
        if (response.status === 200) {
          reset();
          onSuccess?.();
          onClose();
        }
      } else {
        const promises = data.schedules.map(schedule => {
          const payload = {
            batchId: Number(batchId),
            ...schedule,
          };
          return axios.post('/api/batch/schedule', payload);
        });

        await Promise.all(promises);
        reset();
        onSuccess?.();
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save schedule. Check for duplicate days.');
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
    <Modal isOpen={isOpen} onClose={handleClose} size={fields.length > 1 ? 'large' : 'small'}>
      <div className='w-full'>
        <h2 className='text-2xl font-bold mb-4 text-cyan-400'>
          {isEdit ? 'Edit Schedule' : 'Add Batch Schedule'}
        </h2>

        {error && (
          <div className='mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg text-red-200 backdrop-blur-sm'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border border-cyan-800/50 rounded-xl relative bg-cyan-900/20">
                {!isEdit && fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute top-2 right-2 text-cyan-500 hover:text-red-400 transition-colors"
                  >
                    <FaTrash size={14} />
                  </button>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className='block text-sm font-medium mb-1 text-cyan-300'>
                      Day of Week
                    </label>
                    <select
                      {...register(`schedules.${index}.dayOfWeek`)}
                      className='w-full px-3 py-2 bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors'
                      disabled={loading}>
                      <option value='Monday' className='bg-cyan-950'>Monday</option>
                      <option value='Tuesday' className='bg-cyan-950'>Tuesday</option>
                      <option value='Wednesday' className='bg-cyan-950'>Wednesday</option>
                      <option value='Thursday' className='bg-cyan-950'>Thursday</option>
                      <option value='Friday' className='bg-cyan-950'>Friday</option>
                      <option value='Saturday' className='bg-cyan-950'>Saturday</option>
                      <option value='Sunday' className='bg-cyan-950'>Sunday</option>
                    </select>
                    {formErrors.schedules?.[index]?.dayOfWeek && (
                      <p className='text-red-500 text-sm mt-1'>
                        {formErrors.schedules[index].dayOfWeek.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium mb-1 text-cyan-300'>Room</label>
                    <input
                      type='text'
                      placeholder='e.g., Room 101'
                      {...register(`schedules.${index}.room`)}
                      className='w-full px-3 py-2 bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-cyan-600/50'
                      disabled={loading}
                    />
                    {formErrors.schedules?.[index]?.room && (
                      <p className='text-red-500 text-sm mt-1'>
                        {formErrors.schedules[index].room.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium mb-1 text-cyan-300'>
                      Start Time
                    </label>
                    <input
                      type='time'
                      {...register(`schedules.${index}.startTime`)}
                      className='w-full px-3 py-2 bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors'
                      disabled={loading}
                    />
                    {formErrors.schedules?.[index]?.startTime && (
                      <p className='text-red-500 text-sm mt-1'>
                        {formErrors.schedules[index].startTime.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium mb-1 text-cyan-300'>End Time</label>
                    <input
                      type='time'
                      {...register(`schedules.${index}.endTime`)}
                      className='w-full px-3 py-2 bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors'
                      disabled={loading}
                    />
                    {formErrors.schedules?.[index]?.endTime && (
                      <p className='text-red-500 text-sm mt-1'>
                        {formErrors.schedules[index].endTime.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!isEdit && (
            <button
              type="button"
              onClick={() => append({dayOfWeek: 'Monday', startTime: '09:00', endTime: '10:00', room: ''})}
              className="mt-2 flex items-center gap-2 text-cyan-400 font-medium hover:text-cyan-300 transition-colors"
            >
              <FaPlus size={14} /> Add Another Day
            </button>
          )}

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
              {loading
                ? isEdit
                  ? 'Updating...'
                  : 'Creating...'
                : isEdit
                ? 'Update'
                : 'Create Schedule'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
