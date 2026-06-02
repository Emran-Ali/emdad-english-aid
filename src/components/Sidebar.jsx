'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  FaUsers, 
  FaChalkboardTeacher, 
  FaChartLine, 
  FaStar, 
  FaBookOpen, 
  FaMoneyBillWave, 
  FaHistory, 
  FaUserFriends, 
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaThLarge
} from 'react-icons/fa';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const pathName = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role || 'student';

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: <FaThLarge />,
      roles: ['admin', 'staff', 'student']
    },
    {
      title: 'Users',
      path: '/user',
      icon: <FaUsers />,
      roles: ['admin']
    },
    {
      title: 'Batches',
      path: '/batch',
      icon: <FaChalkboardTeacher />,
      roles: ['admin', 'staff']
    },
    {
      title: 'Students',
      path: '/student',
      icon: <FaUserFriends />,
      roles: ['admin', 'staff']
    },
    {
      title: 'Reviews',
      path: '/reviews',
      icon: <FaStar />,
      roles: ['admin', 'staff']
    },
    {
      title: 'Bookings',
      path: '/booking',
      icon: <FaBookOpen />,
      roles: ['admin', 'staff']
    },
    {
      title: 'Costs',
      path: '/cost',
      icon: <FaMoneyBillWave />,
      roles: ['admin', 'staff']
    },
    {
      title: 'Success Stories',
      path: '/success-story',
      icon: <FaHistory />,
      roles: ['admin', 'staff']
    },
    {
      title: 'Our Team',
      path: '/team-management',
      icon: <FaUserFriends />,
      roles: ['admin']
    }
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed top-0 left-0 h-full z-[105] bg-cyan-950 text-white w-64 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        border-r border-cyan-800/50 shadow-2xl pt-16 md:pt-20
      `}>
        <div className="flex flex-col h-full">
          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
            {filteredItems.map((item) => {
              const isActive = pathName === item.path;
              return (
                <Link 
                  key={item.path} 
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
                    ${isActive 
                      ? 'bg-cyan-700 text-white shadow-lg shadow-cyan-900/50' 
                      : 'text-cyan-300 hover:bg-cyan-900/50 hover:text-white'}
                  `}
                >
                  <span className={`text-xl transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.title}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-cyan-800/50 bg-cyan-950/50">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 rounded-full bg-cyan-800 flex items-center justify-center text-cyan-400 font-bold border border-cyan-700">
                {session?.user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="font-semibold truncate">{session?.user?.name || 'User'}</span>
                <span className="text-xs text-cyan-400 capitalize">{role}</span>
              </div>
            </div>
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors group"
            >
              <FaSignOutAlt className="text-xl group-hover:translate-x-1 transition-transform" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
