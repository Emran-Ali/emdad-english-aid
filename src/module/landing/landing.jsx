import ProfileCard from '@/components/ProfileCard';

const Landing = () => {
  const profile = [
    {
      name: 'MD Emdadul Haque',
      role: 'Director',
      contact: '01718-387574',
      image: 'assets/image/gaffer.jpg',
      socialLinks: {
        facebook:
          'https://www.facebook.com/DreamersEnglishSuggestion?mibextid=ZbWKwL',
        linkedin: 'https://www.linkedin.com/in/itsemran/',
        twitter: 'https://twitter.com/EmdadulHaque',
        instagram: 'https://www.instagram.com/emdadulhaque/',
      },
    },
    {
      name: 'MD Emran Ali',
      role: 'Developer',
      contact: '01718-387574',
      image: 'assets/image/gaffer.jpg',
      socialLinks: {
        facebook:
          'https://www.facebook.com/DreamersEnglishSuggestion?mibextid=ZbWKwL',
        linkedin: 'https://www.linkedin.com/in/itsemran/',
        twitter: 'https://twitter.com/EmdadulHaque',
        instagram: 'https://www.instagram.com/emdadulhaque/',
      },
    },

    {
      name: 'Abdul Gaffer',
      role: 'Manager',
      contact: '01718-387574',
      image: 'assets/image/gaffer.jpg',
      socialLinks: {
        facebook:
          'https://www.facebook.com/DreamersEnglishSuggestion?mibextid=ZbWKwL',
        linkedin: 'https://www.linkedin.com/in/itsemran/',
        twitter: 'https://twitter.com/EmdadulHaque',
        instagram: 'https://www.instagram.com/emdadulhaque/',
      },
    },
    {
      name: 'Jahid Hasan',
      role: 'Manager',
      contact: '01718-387574',
      image: 'assets/image/gaffer.jpg',
      socialLinks: {
        facebook:
          'https://www.facebook.com/DreamersEnglishSuggestion?mibextid=ZbWKwL',
        linkedin: 'https://www.linkedin.com/in/itsemran/',
        twitter: 'https://twitter.com/EmdadulHaque',
        instagram: 'https://www.instagram.com/emdadulhaque/',
      },
    },
  ];
  return (
    <div className='container mx-auto px-4 py-8'>
      <h2
        className="text-3xl font-bold text-center mb-8 
    text-white-800 
    relative 
    after:content-[''] 
    after:absolute 
    after:bottom-[-10px] 
    after:left-1/2 
    after:transform 
    after:translate-x-[-50%] 
    after:w-16 
    after:h-1 
    after:bg-blue-500">
        Let's Meet Our Team
      </h2>
      <div className='grid justify-between w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-6'>
        {profile.map((profileItem) => (
          <ProfileCard key={profileItem.id} profile={profileItem} />
        ))}
      </div>
    </div>
  );
};

export default Landing;
