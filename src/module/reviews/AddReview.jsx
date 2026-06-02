'use client';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '@/components/Modal';
import { FaStar } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function AddReview({ isOpen, onClose, mutate, initialData }) {
  const [students, setStudents] = useState([]);
  const { register, handleSubmit, reset, formState: { errors }, watch, setValue } = useForm({
    defaultValues: {
      rating: 5,
      isShown: true,
      studentId: '',
      reviewerName: '',
      reviewerHandle: '',
      content: ''
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        studentId: initialData.studentId || ''
      });
    } else {
      reset({
        rating: 5,
        isShown: true,
        studentId: '',
        reviewerName: '',
        reviewerHandle: '',
        content: ''
      });
    }
  }, [initialData, reset]);

  const [loading, setLoading] = useState(false);
  const currentRating = watch('rating');
  const selectedStudentId = watch('studentId');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get('/api/user?per_page=-1&role=student');
        setStudents(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch students', err);
      }
    };
    if (isOpen) {
      fetchStudents();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedStudentId && !initialData) {
      const student = students.find(s => s.id === Number(selectedStudentId));
      if (student) {
        setValue('reviewerName', student.name);
      }
    }
  }, [selectedStudentId, students, setValue, initialData]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const payload = {
        ...data,
        studentId: data.studentId ? Number(data.studentId) : null
      };
      if (initialData) {
        await axios.put('/api/reviews', { ...payload, id: initialData.id });
        toast.success('Review updated successfully');
      } else {
        await axios.post('/api/reviews', payload);
        toast.success('Review added successfully');
      }
      reset();
      mutate();
      onClose();
    } catch (error) {
      console.error('Failed to save review:', error);
      toast.error('Failed to save review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Review" : "Add New Review"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-1">Associate Student (Optional)</label>
            <select
              {...register('studentId')}
              className="w-full p-2 bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg focus:outline-none focus:border-cyan-500"
            >
              <option value="" className="bg-cyan-950">Select Student</option>
              {students.map(s => (
                <option key={s.id} value={s.id} className="bg-cyan-950">
                  {s.name} ({s.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-1">Reviewer Name</label>
            <input
              {...register('reviewerName', { required: 'Name is required' })}
              className="w-full p-2 bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg focus:outline-none focus:border-cyan-500"
              placeholder="John Doe"
            />
            {errors.reviewerName && <p className="text-red-500 text-xs mt-1">{errors.reviewerName.message}</p>}
          </div>
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
