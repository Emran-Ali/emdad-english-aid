import {useGSAP} from '@gsap/react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Image from 'next/image';
import {useRef} from 'react';

gsap.registerPlugin(ScrollTrigger);

const FeaturesExternal = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    const container = containerRef.current;
    if (!container) return;

    // Target the two cards
    const leftCard = container.querySelector('.left-card');
    const rightCard = container.querySelector('.right-card');

    // Initial off-screen positions
    gsap.set(leftCard, {x: '-120%', opacity: 0});
    gsap.set(rightCard, {x: '120%', opacity: 0});

    // ScrollTrigger: play on enter
    gsap.to([leftCard, rightCard], {
      x: 0,
      opacity: 1,
      duration: 2,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.external',
        start: 'top 80%', // Start when top of container hits 80% of viewport
        markers: false,
        toggleActions: 'play none none reverse', // Play on enter, reverse on leave back
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  });

  return (
    <div ref={containerRef} className='external flex flex-wrap -m-5'>
      <div className='w-full md:w-1/2 p-5 left-card'>
        {' '}
        {/* Add left-card class */}
        <div className='relative px-4 sm:px-16 pt-14 pb-16 h-full bg-gradient-radial-dark overflow-hidden border border-gray-900 border-opacity-30 rounded-3xl'>
          {/* Your left card content unchanged */}
          <div className='relative w-full mb-10'>
            <h1 className='text-5xl font-bold text-center text-white tracking-tighter'>
              300+
            </h1>
          </div>
          <div className='relative z-10 max-w-sm text-center mx-auto'>
            <h2 className='mb-6 text-5xl text-white tracking-tighter'>
              Growing Number of Students with us
            </h2>
            <p className='text-white text-opacity-60'>
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout. The
              point of using Lorem Ipsum i
            </p>
          </div>
          <div className='absolute bottom-0 right-0 w-full h-full'>
            <Image
              src='/assets/template-images/features/bg-gray-2.png'
              alt='Background pattern'
              fill
              sizes='100vw'
              className='object-cover'
            />
          </div>
        </div>
      </div>
      <div className='w-full md:w-1/2 p-5 right-card'>
        {' '}
        {/* Add right-card class */}
        <div className='relative px-4 sm:px-16 pt-14 pb-16 h-full bg-gradient-radial-dark overflow-hidden border border-gray-900 border-opacity-30 rounded-3xl'>
          {/* Your right card content unchanged */}
          <div className='mb-14 max-w-sm mx-auto'>
            <div className='flex flex-wrap justify-center'>
              <div className='w-auto p-2'>
                <div className='relative h-28 w-28'>
                  <Image
                    src='/assets/template-logos/un1.jpg'
                    className='rounded-lg'
                    alt='University logo 1'
                    fill
                    sizes='112px'
                  />
                </div>
              </div>
              <div className='w-auto p-2'>
                <div className='relative h-28 w-28'>
                  <Image
                    src='/assets/template-logos/un2.jpg'
                    className='rounded-lg'
                    alt='University logo 2'
                    fill
                    sizes='112px'
                  />
                </div>
              </div>
              <div className='w-auto p-2'>
                <div className='relative h-28 w-28'>
                  <Image
                    src='/assets/template-logos/un3.webp'
                    className='rounded-lg'
                    alt='University logo 3'
                    fill
                    sizes='112px'
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='relative z-10 max-w-sm text-center mx-auto'>
            <h2 className='mb-6 text-5xl text-white tracking-tighter'>
              Take a tour of our{' '}
              <span className='text-lime-400'>Study Abroad</span> Consultation
              Center
            </h2>
            <p className='text-white text-opacity-60'>
              Explore the gateway to global education! <br />
              We help students from Bangladesh achieve their dream of studying
              at top universities around the world guiding you every step of the
              way from university selection to visa processing. Whether you're
              aiming for the{' '}
              <span className='text-lime-400'>
                USA, UK, Canada, Australia, orEurope
              </span>{' '}
              our expert advisors are here to make your journey smooth and
              successful.
            </p>
          </div>
          <div className='absolute bottom-0 left-0 w-full h-full scale-x-[-1]'>
            <Image
              src='/assets/template-images/features/bg-gray-2.png'
              alt='Background pattern'
              fill
              sizes='100vw'
              className='object-cover'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesExternal;
