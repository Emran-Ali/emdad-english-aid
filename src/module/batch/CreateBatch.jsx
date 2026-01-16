'use client';

import {batchSchema} from '@emran/service/validation/batch/batchValidation';
import {yupResolver} from '@hookform/resolvers/yup';
import {useBatchService} from '@service/BatchService';
import {useForm} from 'react-hook-form';

export default function AddEditBatch({onSuccess, onClose}) {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(batchSchema),
  });
  const {loading, error, createBatch} = useBatchService();

  const onSubmit = async (data) => {
    // Normalize payload to match API expectations; batchCode is generated server-side
    const payload = {
      name: data.name,
      type: data.type,
      academicYear: data.academicYear,
      maxStudents: data.maxStudents,
      startDate: data.startDate || null,
      endDate: data.endDate || null,
      batchTime: data.batchTime || null,
      fees: data.fees || null,
      isActive: data.isActive === undefined ? true : data.isActive,
    };

    const res = await createBatch('/api/batch', payload);
    console.log('submit', error, 'res', res);

    if (res && !error) {
      onSuccess?.();
      onClose?.();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='grid grid-cols-3 gap-4'>
        {/* batchCode generated on server */}

        <div>
          <label htmlFor='name' className='block text-sm font-medium'>
            Name
          </label>
          <input
            {...register('name')}
            type='text'
            id='name'
            className='mt-1 p-2 border rounded w-full'
          />
          {errors.name && (
            <p className='text-red-500 text-sm'>{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor='type' className='block text-sm font-medium'>
            Type
          </label>
          <select
            {...register('type')}
            id='type'
            className='mt-1 p-2 border rounded w-full'>
            <option value=''>Select Type</option>
            <option value='hsc_1st_year'>HSC 1st Year</option>
            <option value='hsc_2nd_year'>HSC 2nd Year</option>
            <option value='admission'>Admission</option>
            <option value='re_admission'>Re Admission</option>
          </select>
          {errors.type && (
            <p className='text-red-500 text-sm'>{errors.type.message}</p>
          )}
        </div>

        <div>
          <label htmlFor='academicYear' className='block text-sm font-medium'>
            Academic Year
          </label>
          <input
            {...register('academicYear')}
            type='number'
            id='academicYear'
            className='mt-1 p-2 border rounded w-full'
          />
          {errors.academicYear && (
            <p className='text-red-500 text-sm'>
              {errors.academicYear.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor='maxStudents' className='block text-sm font-medium'>
            Max Students
          </label>
          <input
            {...register('maxStudents')}
            type='number'
            id='maxStudents'
            className='mt-1 p-2 border rounded w-full'
          />
          {errors.maxStudents && (
            <p className='text-red-500 text-sm'>{errors.maxStudents.message}</p>
          )}
        </div>

        <div>
          <label htmlFor='fees' className='block text-sm font-medium'>
            Fees
          </label>
          <input
            {...register('fees')}
            type='number'
            step='0.01'
            id='fees'
            className='mt-1 p-2 border rounded w-full'
          />
          {errors.fees && (
            <p className='text-red-500 text-sm'>{errors.fees.message}</p>
          )}
        </div>

        <div>
          <label htmlFor='startDate' className='block text-sm font-medium'>
            Start Date
          </label>
          <input
            {...register('startDate')}
            type='date'
            id='startDate'
            className='mt-1 p-2 border rounded w-full'
          />
          {errors.startDate && (
            <p className='text-red-500 text-sm'>{errors.startDate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor='endDate' className='block text-sm font-medium'>
            End Date
          </label>
          <input
            {...register('endDate')}
            type='date'
            id='endDate'
            className='mt-1 p-2 border rounded w-full'
          />
          {errors.endDate && (
            <p className='text-red-500 text-sm'>{errors.endDate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor='batchTime' className='block text-sm font-medium'>
            Batch Time
          </label>
          <input
            {...register('batchTime')}
            type='time'
            id='batchTime'
            className='mt-1 p-2 border rounded w-full'
          />
          {errors.batchTime && (
            <p className='text-red-500 text-sm'>{errors.batchTime.message}</p>
          )}
        </div>

        <div className='col-span-3'>
          <button
            type='submit'
            className='mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}
