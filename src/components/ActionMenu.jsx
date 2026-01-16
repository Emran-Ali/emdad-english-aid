'use client';

import {useEffect, useRef, useState} from 'react';
import {HiEllipsisVertical} from 'react-icons/hi2';

export default function ActionMenu({actions}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='relative inline-block' ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='p-2 text-gray-500 hover:text-white rounded-lg hover:bg-gray-700 transition'
        title='Actions'>
        <HiEllipsisVertical className='w-5 h-5' />
      </button>

      {isOpen && (
        <div className='absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50'>
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                action.onClick();
                setIsOpen(false);
              }}
              className='w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg'
              title={action.label}>
              {action.icon && <span className='text-base'>{action.icon}</span>}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
