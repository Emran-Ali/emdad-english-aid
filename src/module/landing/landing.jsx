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
      <div className='text-center'>
        <h2 className='font-heading text-3xl sm:text-5xl lg:text-7xl text-cyan-500 tracking-tighter-xl'>
          Let's Meet Our Team
        </h2>
        <p className='mb-20 text-gray-300 md:max-w-md mx-auto'>
          Global Bank is a strategic branding agency focused on brand creation,
          rebrands, and brand
        </p>
      </div>
      <div className='grid justify-between w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-6'>
        {profile.map((profileItem) => (
          <ProfileCard key={profileItem.id} profile={profileItem} />
        ))}
      </div>
    </div>
  );
};

export default Landing;
