'use client';

import {batchSchema} from '@emran/service/validation/batch/batchValidation';
import {yupResolver} from '@hookform/resolvers/yup';
import {useBatchService} from '@service/BatchService';
import {useForm} from 'react-hook-form';

export default function EditBatch({batchData, onSuccess, onClose}) {
  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    resolver: yupResolver(batchSchema),
    defaultValues: batchData,
  });
  const {loading, error, updateBatch} = useBatchService();

  const onSubmit = async (data) => {
    // Payload with batch ID for update
    const payload = {
      id: batchData.id,
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

    const res = await updateBatch('/api/batch', payload);
    console.log('submit', error, 'res', res);

    if (res && !error) {
      onSuccess?.();
      onClose?.();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='grid grid-cols-3 gap-4'>
        <div>
          <label htmlFor='name' className='block text-sm font-medium text-cyan-300'>
            Name
          </label>
          <input
            {...register('name')}
            type='text'
            id='name'
            className='mt-1 p-2 bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg w-full focus:outline-none focus:border-cyan-500 transition-colors'
          />
          {errors.name && (
            <p className='text-red-500 text-sm'>{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor='type' className='block text-sm font-medium text-cyan-300'>
            Type
          </label>
          <select
            {...register('type')}
            id='type'
            className='mt-1 p-2 bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg w-full focus:outline-none focus:border-cyan-500 transition-colors'>
            <option value='' className='bg-cyan-950'>Select Type</option>
            <option value='hsc_1st_year' className='bg-cyan-950'>HSC 1st Year</option>
            <option value='hsc_2nd_year' className='bg-cyan-950'>HSC 2nd Year</option>
            <option value='admission' className='bg-cyan-950'>Admission</option>
            <option value='re_admission' className='bg-cyan-950'>Re Admission</option>
          </select>
          {errors.type && (
            <p className='text-red-500 text-sm'>{errors.type.message}</p>
          )}
        </div>

        <div>
          <label htmlFor='academicYear' className='block text-sm font-medium text-cyan-300'>
            Academic Year
          </label>
          <input
            {...register('academicYear')}
            type='number'
            id='academicYear'
            className='mt-1 p-2 bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg w-full focus:outline-none focus:border-cyan-500 transition-colors'
          />
          {errors.academicYear && (
            <p className='text-red-500 text-sm'>
              {errors.academicYear.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor='maxStudents' className='block text-sm font-medium text-cyan-300'>
            Max Students
          </label>
          <input
            {...register('maxStudents')}
            type='number'
            id='maxStudents'
            className='mt-1 p-2 bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg w-full focus:outline-none focus:border-cyan-500 transition-colors'
          />
          {errors.maxStudents && (
            <p className='text-red-500 text-sm'>{errors.maxStudents.message}</p>
          )}
        </div>

        <div>
          <label htmlFor='fees' className='block text-sm font-medium text-cyan-300'>
            Fees
          </label>
          <input
            {...register('fees')}
            type='number'
            step='0.01'
            id='fees'
            className='mt-1 p-2 bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg w-full focus:outline-none focus:border-cyan-500 transition-colors'
          />
          {errors.fees && (
            <p className='text-red-500 text-sm'>{errors.fees.message}</p>
          )}
        </div>

        <div>
          <label htmlFor='startDate' className='block text-sm font-medium text-cyan-300'>
            Start Date
          </label>
          <input
            {...register('startDate')}
            type='date'
            id='startDate'
            className='mt-1 p-2 bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg w-full focus:outline-none focus:border-cyan-500 transition-colors'
          />
          {errors.startDate && (
            <p className='text-red-500 text-sm'>{errors.startDate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor='endDate' className='block text-sm font-medium text-cyan-300'>
            End Date
          </label>
          <input
            {...register('endDate')}
            type='date'
            id='endDate'
            className='mt-1 p-2 bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg w-full focus:outline-none focus:border-cyan-500 transition-colors'
          />
          {errors.endDate && (
            <p className='text-red-500 text-sm'>{errors.endDate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor='batchTime' className='block text-sm font-medium text-cyan-300'>
            Batch Time
          </label>
          <input
            {...register('batchTime')}
            type='time'
            id='batchTime'
            className='mt-1 p-2 bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg w-full focus:outline-none focus:border-cyan-500 transition-colors'
          />
          {errors.batchTime && (
            <p className='text-red-500 text-sm'>{errors.batchTime.message}</p>
          )}
        </div>

        <div className='col-span-3 flex gap-4'>
          <button
            type='submit'
            className='mt-4 px-8 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 font-bold transition-all shadow-lg shadow-cyan-900/20'>
            Update Batch
          </button>
          <button
            type='button'
            onClick={onClose}
            className='mt-4 px-8 py-2 bg-gray-600/20 text-gray-400 border border-gray-600/50 rounded-lg hover:bg-gray-600 hover:text-white transition-all duration-200'>
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
