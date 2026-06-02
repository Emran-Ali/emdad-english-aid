'use client';

import Image from 'next/image';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import {useEffect, useState} from 'react';
import axios from 'axios';

const SuccessStory = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchSuccessStories = async () => {
      try {
        const response = await axios.get('/api/success-story?onlyShown=true');
        setStudents(response.data.data);
      } catch (error) {
        console.error('Failed to fetch success stories:', error);
      }
    };
    fetchSuccessStories();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='text-center'>
        <h2 className='font-heading text-3xl sm:text-5xl lg:text-7xl text-cyan-500 tracking-tighter-xl'>
          Story of Our Successful Students
        </h2>
        <p className='mb-20 text-gray-300 md:max-w-md mx-auto'>
          Global Bank is a strategic branding agency focused on brand creation,
          rebrands, and brand
        </p>
      </div>

      {/* Success Stories Slider */}
      <div className='mb-16'>
        <Slider {...sliderSettings}>
          {students.map((student) => (
            <div key={student.id} className='px-2'>
              <div className='h-full'>
                <div className='card px-6 py-8 border border-gray-800 rounded-xl bg-gradient-radial-dark shadow-lg'>
                    <Image
                      src={student.image?.startsWith('/') ? student.image : `/${student.image || 'assets/image/gaffer.jpg'}`}
                      alt={student.studentName}
                      width={208}
                      height={208}
                      className='shadow-lg rounded-full mx-auto h-52 w-52 object-cover'
                    />
                    <div className='pt-6 text-center'>
                      <h5 className='text-xl text-yellow-300 font-bold'>
                        {student.studentName}
                      </h5>
                    <p className='mt-1 text-sm text-white uppercase font-semibold'>
                      {student.university}
                    </p>
                    <p className='mt-1 text-sm text-cyan-400 uppercase font-semibold'>
                      {student.department}
                    </p>
                    <p className='mt-1 text-sm text-white uppercase font-semibold'>
                      Session: {student.session}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default SuccessStory;
