'use client';

import ProfileCard from '@/components/ProfileCard';
import {useEffect, useState} from 'react';
import axios from 'axios';

const TeamMember = () => {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await axios.get('/api/team');
        const formattedData = response.data.data.map((member) => ({
          ...member,
          socialLinks: {
            facebook: member.facebook,
            linkedin: member.linkedin,
            twitter: member.twitter,
            instagram: member.instagram,
            github: member.github,
          },
        }));
        setTeamMembers(formattedData);
      } catch (error) {
        console.error('Failed to fetch team members:', error);
      }
    };
    fetchTeam();
  }, []);

  if (teamMembers.length === 0) return null;

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='text-center'>
        <h2 className='font-heading text-3xl sm:text-5xl lg:text-7xl text-cyan-500 tracking-tighter-xl'>
          Let's Meet Our Team
        </h2>
        <p className='mb-20 text-gray-300 md:max-w-md mx-auto'>
          The dedicated professionals behind Emdad English Aid.
        </p>
      </div>
      <div className='grid justify-between w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-6'>
        {teamMembers.map((member) => (
          <ProfileCard key={member.id} profile={member} />
        ))}
      </div>
    </div>
  );
};

export default TeamMember;
