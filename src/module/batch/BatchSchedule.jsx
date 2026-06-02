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
        <h2 className='text-2xl font-bold mb-4'>
          {isEdit ? 'Edit Schedule' : 'Add Batch Schedule'}
        </h2>

        {error && (
          <div className='mb-4 p-3 bg-red-100 border border-red-400 rounded text-red-700'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border border-gray-200 rounded-lg relative bg-gray-50">
                {!isEdit && fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <FaTrash size={14} />
                  </button>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className='block text-sm font-medium mb-1'>
                      Day of Week
                    </label>
                    <select
                      {...register(`schedules.${index}.dayOfWeek`)}
                      className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-cyan-700 bg-white'
                      disabled={loading}>
                      <option value='Monday'>Monday</option>
                      <option value='Tuesday'>Tuesday</option>
                      <option value='Wednesday'>Wednesday</option>
                      <option value='Thursday'>Thursday</option>
                      <option value='Friday'>Friday</option>
                      <option value='Saturday'>Saturday</option>
                      <option value='Sunday'>Sunday</option>
                    </select>
                    {formErrors.schedules?.[index]?.dayOfWeek && (
                      <p className='text-red-500 text-sm mt-1'>
                        {formErrors.schedules[index].dayOfWeek.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium mb-1'>Room</label>
                    <input
                      type='text'
                      placeholder='e.g., Room 101'
                      {...register(`schedules.${index}.room`)}
                      className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-cyan-700 bg-white'
                      disabled={loading}
                    />
                    {formErrors.schedules?.[index]?.room && (
                      <p className='text-red-500 text-sm mt-1'>
                        {formErrors.schedules[index].room.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium mb-1'>
                      Start Time
                    </label>
                    <input
                      type='time'
                      {...register(`schedules.${index}.startTime`)}
                      className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-cyan-700 bg-white'
                      disabled={loading}
                    />
                    {formErrors.schedules?.[index]?.startTime && (
                      <p className='text-red-500 text-sm mt-1'>
                        {formErrors.schedules[index].startTime.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium mb-1'>End Time</label>
                    <input
                      type='time'
                      {...register(`schedules.${index}.endTime`)}
                      className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-cyan-700 bg-white'
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
              className="mt-2 flex items-center gap-2 text-cyan-700 font-medium hover:text-cyan-800"
            >
              <FaPlus size={14} /> Add Another Day
            </button>
          )}

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
                : 'Create Schedule'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
