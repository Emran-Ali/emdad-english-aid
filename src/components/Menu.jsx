'use client';
import Image from 'next/image';
import Link from 'next/link';
import {FaUserCog} from 'react-icons/fa';

const Menu = () => {


  return (
    <div className='sticky top-0 bg-cyan-950  rounded-b-xl z-[100]'>
      <div className='align-middle flex justify-between'>
        <Link href='/' className='inline-flex items-center px-4'>
          <Image src='/assets/image/logo.png' height={48} width={48} alt="Logo" />
          <div className='hidden md:block'>
            <span className='bg-clip-text font-bold mx-4 text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-white'>
              Emdad's English Aid
            </span>
          </div>
        </Link>
        <ul className='flex items-center gap-1 p-2'>
          <li >
            <Link href='/user'>
              <div
                className='p-2 md:p-3'>
                <FaUserCog className='font-bold text-xl md:text-3xl ' />
              </div>
            </Link>
          </li>

        </ul>
      </div>
    </div>
  );
};

export default Menu;
