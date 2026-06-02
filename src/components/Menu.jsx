'use client';
import Image from 'next/image';
import Link from 'next/link';
import {FaUserCog, FaUserEdit, FaSignOutAlt, FaBars} from 'react-icons/fa';
import { signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';

const Menu = ({ onToggleSidebar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='sticky top-0 bg-cyan-950/80 backdrop-blur-md border-b border-cyan-800/50 z-[120]'>
      <div className='align-middle flex justify-between h-16 md:h-20'>
        <Link href='/' className='inline-flex items-center px-6 group'>
          <div className='relative w-10 h-10 md:w-12 md:h-12 transition-transform duration-300 group-hover:scale-110'>
            <Image src='/assets/image/logo.png' fill alt="Logo" className='object-contain' />
          </div>
          <div className='hidden md:block'>
            <span className='bg-clip-text font-bold ml-4 text-xl tracking-tight text-transparent bg-gradient-to-r from-cyan-400 via-white to-green-400'>
              Emdad's English Aid
            </span>
          </div>
        </Link>
        <ul className='flex items-center gap-2 p-2 px-6'>
          <li className='relative' ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='p-2 md:p-3 text-cyan-400 hover:text-white transition-colors'
            >
              <FaUserCog className='font-bold text-xl md:text-3xl ' />
            </button>
            
            {isOpen && (
              <div className='absolute right-0 mt-2 w-48 bg-cyan-950 border border-cyan-800 rounded-xl shadow-2xl py-2 overflow-hidden animate-in fade-in zoom-in duration-200'>
                <Link 
                  href='/profile' 
                  className='flex items-center gap-3 px-4 py-3 text-sm text-cyan-100 hover:bg-cyan-800 transition-colors'
                  onClick={() => setIsOpen(false)}
                >
                  <FaUserEdit /> Update Profile
                </Link>
                <div className='h-[1px] bg-cyan-800 mx-2 my-1' />
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className='w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors'
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </li>
          <li className="lg:hidden">
            <button
              onClick={onToggleSidebar}
              className='p-2 md:p-3 text-cyan-400 hover:text-white transition-colors'
            >
              <FaBars className='font-bold text-xl md:text-3xl ' />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Menu;
