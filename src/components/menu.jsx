'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {FaUsersCog} from 'react-icons/fa';
import {SiGoogleclassroom} from 'react-icons/si';

const Menu = () => {
  const pathName = usePathname();

  const active =
    'p-1 bg-gradient-to-r from-green-400 via-pink-500 to-white text-black rounded-full bg-[length:200%_200%] animate-gradient-x';

  return (
    <div className='sticky top-0 bg-cyan-900 hover:bg-cyan-800 rounded-b-xl'>
      <div className='align-middle flex justify-between'>
        <Link href='/' className='inline-flex items-center px-4'>
          <img src='assets/image/logo.png' height={48} width={48} />
          <div className='hidden md:block'>
            <span className='bg-clip-text font-bold mx-4 text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-white'>
              Emdad's English Aid
            </span>
          </div>
        </Link>
        <ul className='flex items-center gap-1 p-2'>
          <li className={pathName === '/user' ? active : ''}>
            <Link href='/user'>
              <div
                className={
                  pathName === '/user'
                    ? 'p-2 md:p-3 rounded-full bg-lime-400 animate-none'
                    : 'p-2 md:p-3'
                }>
                <FaUsersCog className='font-bold text-xl md:text-3xl ' />
              </div>
            </Link>
          </li>
          <li className={pathName === '/batch' ? active : ''}>
            <Link href='/batch'>
              <div
                className={
                  pathName === '/batch'
                    ? 'p-2 md:p-3 rounded-full bg-lime-400'
                    : 'p-2 md:p-3'
                }>
                <SiGoogleclassroom className='font-bold text-xl md:text-3xl' />
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Menu;
