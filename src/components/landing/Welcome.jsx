const Welcome = () => {
  return (
    <div className='relative pt-10 lg:pt-18'>
      <div className='relative z-10 container px-4 md:max-w-90 mx-auto'>
        <div className='relative mb-24 text-center mx-auto'>
          <img
            className='absolute top-44 -left-36 hidden md:block'
            src='/assets/template-images/headers/star2.svg'
            alt=''
          />
          <img
            className='absolute top-10 -right-36 hidden md:block'
            src='/assets/template-images/headers/star2.svg'
            alt=''
          />
          <h1 className='my-4 text-2xl lg:text-5xl  tracking-tighter text-white opacity-75 font-bold leading-tight text-center md:text-left'>
            Welcome To <br />
            <span className='text-5xl lg:text-8xl  bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500'>
              Emdad's English Aid
            </span>
          </h1>
          <p className='leading-normal text-yellow-400 md:text-2xl mb-8 text-center md:text-left'>
            The best English private program in Rajshahi !
          </p>
          <a
            className='inline-block px-8 py-4 tracking-tighter bg-lime-400 hover:bg-lime-500 text-black focus:ring-4 focus:ring-lime-500 focus:ring-opacity-40 rounded-full transition duration-300'
            href='#'>
            Start now
          </a>
        </div>
      </div>
      <img
        className='absolute bottom-0 right-0'
        src='/assets/template-images/headers/lines2.svg'
        alt=''
      />
    </div>
  );
};

export default Welcome;
