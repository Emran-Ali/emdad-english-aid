'use client';

import Image from 'next/image';

import {useEffect, useState} from 'react';
import axios from 'axios';

const Reviews = () => {
  const [reviewsList, setReviewsList] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('/api/reviews?onlyShown=true');
        setReviewsList(response.data.data);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    };
    fetchReviews();
  }, []);

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="text-center">
          <h2 className="font-heading text-3xl sm:text-5xl lg:text-7xl text-cyan-500 tracking-tighter-xl">
            Valuable Feedback from Our Students
          </h2>
          <p className="mb-20 text-gray-300 md:max-w-md mx-auto">
            Real experiences from students who have been part of Emdad English Aid.
          </p>
        </div>
        <div className="flex flex-wrap -m-3">
          {reviewsList.map((review) => (
            <div key={review.id} className="w-full md:w-1/2 lg:w-1/4 p-3">
              <div className="px-6 py-8 border border-gray-800 rounded-3xl h-full flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center -m-3 mb-3">
                    <div className="w-auto p-3">
                      <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {review.reviewerName?.charAt(0)}
                      </div>
                    </div>
                    <div className="w-auto p-3">
                      <h2 className="text-2xl text-white">{review.reviewerName}</h2>
                      <p className="text-sm text-gray-300">{review.reviewerHandle}</p>
                    </div>
                  </div>
                  <p className="mb-4 text-white">
                    {review.content}
                  </p>
                </div>
                <div>
                  <div className="flex flex-wrap items-center -m-2.5 mb-1.5">
                    <div className="w-auto p-2.5">
                      <p className="text-sm text-gray-300">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Reviews;
