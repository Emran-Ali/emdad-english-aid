'use client';

import {useEffect, useState} from 'react';
import axios from 'axios';

const BatchBooking = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    contactNumber: '',
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await axios.get('/api/batch');
        // Filter batches that are accepting students
        const acceptingBatches = response.data.data.filter(b => b.isAcceptingStudents);
        setBatches(acceptingBatches);
      } catch (error) {
        console.error('Failed to fetch batches:', error);
      }
    };
    fetchBatches();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBatch) {
      alert('Please select a batch');
      return;
    }

    try {
      setStatus('Booking...');
      await axios.post('/api/booking', {
        batchId: selectedBatch.id,
        ...formData
      });
      setStatus('Booking successful! We will contact you soon.');
      setFormData({studentName: '', studentEmail: '', contactNumber: ''});
      setSelectedBatch(null);
    } catch (error) {
      setStatus('Booking failed: ' + (error.response?.data?.message || error.message));
    }
  };

  if (batches.length === 0) return null;

  return (
    <div className='container mx-auto px-4 py-16' id='book-now'>
      <div className='text-center mb-12'>
        <h2 className='font-heading text-3xl sm:text-5xl lg:text-7xl text-cyan-500 tracking-tighter-xl'>
          Book Your Seat
        </h2>
        <p className='mt-4 text-gray-300 max-w-md mx-auto'>
          Join our upcoming batches and start your journey to success.
        </p>
      </div>

      <div className='max-w-4xl mx-auto bg-gray-900 border border-gray-800 p-8 rounded-3xl'>
        <form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-4'>
            <div>
              <label className='block text-gray-300 mb-2'>Select Batch</label>
              <select
                className='w-full bg-gray-800 border border-gray-700 text-white rounded-xl p-3 focus:outline-none focus:border-cyan-500'
                onChange={(e) => setSelectedBatch(batches.find(b => b.id === Number(e.target.value)))}
                required
              >
                <option value=''>Select a running batch</option>
                {batches.map(batch => (
                  <option key={batch.id} value={batch.id}>
                    {batch.name} ({batch.batchCode}) - {batch.fees} BDT
                  </option>
                ))}
              </select>
            </div>
            {selectedBatch && (
              <div className='p-4 bg-gray-800 rounded-xl border border-gray-700'>
                <p className='text-cyan-400 font-bold'>{selectedBatch.name}</p>
                <p className='text-gray-300 text-sm'>Time: {selectedBatch.batchTime}</p>
                <p className='text-gray-300 text-sm'>Start Date: {new Date(selectedBatch.startDate).toLocaleDateString()}</p>
              </div>
            )}
          </div>

          <div className='space-y-4'>
            <input
              type='text'
              placeholder='Full Name'
              className='w-full bg-gray-800 border border-gray-700 text-white rounded-xl p-3 focus:outline-none focus:border-cyan-500'
              value={formData.studentName}
              onChange={(e) => setFormData({...formData, studentName: e.target.value})}
              required
            />
            <input
              type='email'
              placeholder='Email Address'
              className='w-full bg-gray-800 border border-gray-700 text-white rounded-xl p-3 focus:outline-none focus:border-cyan-500'
              value={formData.studentEmail}
              onChange={(e) => setFormData({...formData, studentEmail: e.target.value})}
              required
            />
            <input
              type='tel'
              placeholder='Contact Number'
              className='w-full bg-gray-800 border border-gray-700 text-white rounded-xl p-3 focus:outline-none focus:border-cyan-500'
              value={formData.contactNumber}
              onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
              required
            />
            <button
              type='submit'
              className='w-full py-4 px-8 font-medium tracking-tighter bg-green-400 hover:bg-green-500 text-black rounded-full transition duration-300'
            >
              Confirm Booking
            </button>
            {status && <p className='text-center text-cyan-400 mt-2'>{status}</p>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default BatchBooking;
