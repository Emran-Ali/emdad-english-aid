'use client';

import Image from 'next/image';
import {useEffect, useState} from 'react';
import axios from 'axios';

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await axios.get('/api/team');
        setTeamMembers(response.data.data);
      } catch (error) {
        console.error('Failed to fetch team members:', error);
      }
    };
    fetchTeam();
  }, []);

  if (teamMembers.length === 0) return null;

  return (
    <div className='container mx-auto px-4 py-16'>
      <div className='text-center mb-16'>
        <h2 className='font-heading text-3xl sm:text-5xl lg:text-7xl text-cyan-500 tracking-tighter-xl'>
          Meet Our Team
        </h2>
        <p className='mt-4 text-gray-300 max-w-md mx-auto'>
          The dedicated professionals behind Emdad English Aid.
        </p>
      </div>

      <div className='flex flex-wrap -m-4'>
        {teamMembers.map((member) => (
          <div key={member.id} className='w-full md:w-1/2 lg:w-1/3 p-4'>
            <div className='card px-6 py-8 border border-gray-800 rounded-xl bg-gradient-radial-dark shadow-lg h-full text-center'>
              <div className='relative w-48 h-48 mx-auto mb-6'>
                <Image
                  src={member.image?.startsWith('/') ? member.image : `/${member.image || 'assets/image/gaffer.jpg'}`}
                  alt={member.name}
                  fill
                  className='shadow-lg rounded-full object-cover'
                />
              </div>
              <h5 className='text-2xl text-yellow-300 font-bold'>
                {member.name}
              </h5>
              <p className='mt-1 text-sm text-cyan-400 uppercase font-semibold mb-4'>
                {member.role}
              </p>
              <p className='text-gray-300 text-sm'>
                {member.bio}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
