'use client';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';
import Modal from '@/components/Modal';
import { FaStar } from 'react-icons/fa';

export default function AddReview({ isOpen, onClose, mutate }) {
  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm({
    defaultValues: {
      rating: 5,
      isShown: true
    }
  });
  const [loading, setLoading] = useState(false);
  const currentRating = watch('rating');

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await axios.post('/api/reviews', data);
      reset();
      mutate();
      onClose();
    } catch (error) {
      console.error('Failed to add review:', error);
      alert('Failed to add review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Review">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-1">Reviewer Name</label>
          <input
            {...register('reviewerName', { required: 'Name is required' })}
            className="w-full p-2 bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg focus:outline-none focus:border-cyan-500"
            placeholder="John Doe"
          />
          {errors.reviewerName && <p className="text-red-500 text-xs mt-1">{errors.reviewerName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-1">Reviewer Handle (Optional)</label>
          <input
            {...register('reviewerHandle')}
            className="w-full p-2 bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg focus:outline-none focus:border-cyan-500"
            placeholder="@johndoe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-1">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <label key={num} className="cursor-pointer">
                <input
                  type="radio"
                  value={num}
                  {...register('rating')}
                  className="hidden"
                />
                <FaStar className={`text-2xl ${num <= currentRating ? 'text-yellow-500' : 'text-gray-600'}`} />
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-1">Review Content</label>
          <textarea
            {...register('content', { required: 'Content is required' })}
            className="w-full p-2 bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg focus:outline-none focus:border-cyan-500 min-h-[100px]"
            placeholder="Write the review here..."
          />
          {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register('isShown')}
            id="isShown"
            className="w-4 h-4 bg-cyan-900/50 border-cyan-700/50 rounded"
          />
          <label htmlFor="isShown" className="text-sm font-medium text-cyan-300">Show on Landing Page immediately</label>
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
            {loading ? 'Adding...' : 'Add Review'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
