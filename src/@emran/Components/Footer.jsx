export default function Footer() {
  return (
    <div className='h-full'>
      <div className='w-full bg-lime-400 rounded-5xl p-6 text-sm text-center md:text-left fade-in'>
        <a className='text-gray-500 no-underline hover:no-underline' href='#'>
          &copy; Emdad English Aid
        </a>
        - Developed by
        <a
          className='text-gray-500 no-underline hover:no-underline'
          target='_black'
          href='https://www.linkedin.com/in/itsemran/'>
          {' '}
          MD Emran Ali
        </a>
      </div>
    </div>
  );
}
