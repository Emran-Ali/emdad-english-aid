import {
  FaFacebook,
  FaGoogle,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from 'react-icons/fa';

const ProfileCard = ({profile}) => {
  // Social icon mapping
  const socialIcons = {
    google: FaGoogle,
    facebook: FaFacebook,
    twitter: FaTwitter,
    linkedin: FaLinkedin,
    instagram: FaInstagram,
  };

  // Social link colors
  const socialColors = {
    google: 'bg-red-600',
    facebook: 'bg-blue-600',
    twitter: 'bg-sky-400',
    linkedin: 'bg-blue-700',
    instagram: 'bg-pink-500',
  };

  return (
    <div className='w-full h-full'>
      <div className='card bg-gray-500 p-2 rounded-lg'>
        <img
          alt={profile.name}
          src={profile.image}
          className='shadow-lg rounded-full mx-auto h-52 w-52 object-cover'
        />
        <div className='pt-6 text-center'>
          <h5 className='text-xl text-yellow-300 font-bold'>{profile.name}</h5>
          <p className='mt-1 text-sm text-white uppercase font-semibold'>
            {profile.role}
          </p>
          <p className='mt-1 text-sm text-cyan-400 uppercase font-semibold'>
            Contact : {profile.contact}
          </p>

          {/* Dynamic Social Links */}
          <div className='mt-6 flex justify-center space-x-2'>
            {Object.entries(profile.socialLinks || {}).map(
              ([platform, link]) => {
                const Icon = socialIcons[platform];
                const bgColor = socialColors[platform];

                return Icon ? (
                  <a
                    key={platform}
                    href={link}
                    target='_blank'
                    rel='noopener noreferrer'
                    className={`${bgColor} text-white w-8 h-8 rounded-full flex items-center justify-center hover:opacity-75 transition-all`}>
                    <Icon className='w-4 h-4' />
                  </a>
                ) : null;
              },
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
