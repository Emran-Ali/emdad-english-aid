'use client';
import {useState} from 'react';
const Navbar = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const handleMobileNav = () => {
    setMobileNavOpen(!mobileNavOpen);
  };
  return (
    <div className='relative overflow-hidden'>
      <div className='container px-4 mx-auto'>
        <div className='flex items-center justify-between pt-6 -m-2'>
          <div className='w-auto p-2'>
            <div className='flex flex-wrap items-center'>
              <div className='w-auto'>
                <a
                  className='relative z-10 inline-flex items-center space-x-3'
                  href='/'>
                  <img
                    src='/assets/image/logo.png'
                    className='w-42 h-42 md:w-[65px] md:h-[65px] rounded-full'
                    height={56}
                    width={56}
                    alt='logo'
                  />

                  <span className='text-bold text-2xl sm:text-3xl md:text-5xl  bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500'>
                    Emdad's English Aid
                  </span>
                </a>
              </div>
            </div>
          </div>
          <div className='w-auto p-2'>
            <div className='flex flex-wrap items-center'>
              <div className='w-auto hidden lg:block'>
                <ul className='flex items-center mr-12'>
                  <li className='mr-12 text-white font-medium hover:text-opacity-90 tracking-tighter'>
                    <a href='about.html'>About</a>
                  </li>
                  <li className='mr-12 text-white font-medium hover:text-opacity-90 tracking-tighter'>
                    <a href='pricing.html'>Pricing</a>
                  </li>
                  <li className='mr-12 text-white font-medium hover:text-opacity-90 tracking-tighter'>
                    <a href='blog.html'>Blog</a>
                  </li>
                  <li className='text-white font-medium hover:text-opacity-90 tracking-tighter'>
                    <a href='contact.html'>Contact</a>
                  </li>
                </ul>
              </div>
              <div className='w-auto hidden lg:block'>
                <div className='inline-block'>
                  <a
                    className='inline-block px-8 py-4 text-white hover:text-black tracking-tighter hover:bg-lime-400 border-2 border-white focus:border-lime-400 focus:border-opacity-40 hover:border-lime-400 focus:ring-4 focus:ring-lime-400 focus:ring-opacity-40 rounded-full transition duration-300'
                    href='login.html'>
                    Login
                  </a>
                </div>
              </div>
              <div className='w-auto lg:hidden'>
                <button
                  className='relative z-10 inline-block'
                  onClick={handleMobileNav}>
                  <svg
                    className='text-lime-400'
                    width='48'
                    height='48'
                    viewbox='0 0 48 48'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'>
                    <rect
                      width='46'
                      height='46'
                      rx='28'
                      fill='currentColor'></rect>
                    <path
                      d='M37 32H19M37 24H19'
                      stroke='black'
                      stroke-width='1.5'
                      stroke-linecap='round'
                      stroke-linejoin='round'></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* mobile nave */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-full sm:max-w-xs z-50 transition-transform duration-1000 ease-in-out transform
          ${
            mobileNavOpen
              ? 'translate-x-0 translate-y-0'
              : '-translate-x-full -translate-y-full'
          }`}>
        <div
          className='sticky top-0 bg-black opacity-60'
          onClick={handleMobileNav}></div>
        <nav className='relative z-10 px-9 pt-8 h-full w-full bg-black overflow-y-auto'>
          <div className='flex flex-wrap justify-between h-full'>
            <div className='w-full'>
              <div className='flex items-center justify-between -m-2'>
                <div className='w-auto p-2'>
                  <a className='inline-block' href='/'>
                    <span className='text-bold text-xl md:text-5xl  bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500'>
                      Emdad's English Aid
                    </span>
                  </a>
                </div>
                <div className='w-auto p-2'>
                  <button
                    className='inline-block text-white'
                    onClick={handleMobileNav}>
                    <svg
                      width='24'
                      height='24'
                      viewbox='0 0 24 24'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'>
                      <path
                        d='M6 18L18 6M6 6L18 18'
                        stroke='currentColor'
                        stroke-width='2'
                        stroke-linecap='round'
                        stroke-linejoin='round'></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className='flex flex-col justify-center py-16 w-full'>
              <ul>
                <li className='mb-8 text-white font-medium hover:text-opacity-90 tracking-tighter'>
                  <a href='about.html'>About</a>
                </li>
                <li className='mb-8 text-white font-medium hover:text-opacity-90 tracking-tighter'>
                  <a href='pricing.html'>Pricing</a>
                </li>
                <li className='mb-8 text-white font-medium hover:text-opacity-90 tracking-tighter'>
                  <a href='blog.html'>Blog</a>
                </li>
                <li className='text-white font-medium hover:text-opacity-90 tracking-tighter'>
                  <a href='contact.html'>Contact</a>
                </li>
              </ul>
            </div>
            <div className='flex flex-col justify-end w-full pb-8'>
              <a
                className='inline-block px-8 py-4 text-center text-white hover:text-black tracking-tighter hover:bg-lime-400 border-2 border-white focus:border-lime-400 focus:border-opacity-40 hover:border-lime-400 focus:ring-4 focus:ring-lime-400 focus:ring-opacity-40 rounded-full transition duration-300'
                href='login.html'>
                Login
              </a>
            </div>
          </div>
        </nav>
      </div>
      <img
        className='absolute top-0 left-0 md:left-48'
        src='/assets/template-images/headers/layer-blur.svg'
        alt=''
      />
    </div>
  );
};

export default Navbar;
