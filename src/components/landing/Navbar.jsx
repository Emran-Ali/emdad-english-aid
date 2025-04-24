'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useState} from 'react';
import {GiCrossedBones} from 'react-icons/gi';
import {MdOutlineMenuOpen} from 'react-icons/md';

const Navbar = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const handleMobileNav = () => {
    setMobileNavOpen(!mobileNavOpen);
  };
  const path = usePathname();

  console.log(path);
  const activeClass = 'rounded-3xl border border-lime-400 py-2 px-4';

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
                  <li
                    className={`mr-12 cursor-pointer text-white font-medium hover:text-opacity-90 tracking-tighter ${
                      path === '/about' ? activeClass : ''
                    }`}>
                    <Link href='/about'>Abouts</Link>
                  </li>
                  <li
                    className={`mr-12 text-white font-medium hover:text-opacity-90 tracking-tighter ${
                      path === '/about' ? activeClass : ''
                    }`}>
                    <a href='pricing.html'>Pricing</a>
                  </li>
                  <li
                    className={`mr-12 text-white font-medium hover:text-opacity-90 tracking-tighter ${
                      path === '/about' ? activeClass : ''
                    }`}>
                    <a href='blog.html'>Blog</a>
                  </li>
                  <li
                    className={`mr-12 text-white font-medium hover:text-opacity-90 tracking-tighter ${
                      path === '/about' ? activeClass : ''
                    }`}>
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
                  className='relative z-10 inline-block bg-lime-400 rounded-full p-2 text-black hover:bg-lime-500 focus:ring-4 focus:ring-lime-500 focus:ring-opacity-40'
                  onClick={handleMobileNav}>
                  <MdOutlineMenuOpen className='w-8 h-8 font-bold' />
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
                    <GiCrossedBones className='w-8 h-8 text-lime-400 hover:rotate-180' />
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
