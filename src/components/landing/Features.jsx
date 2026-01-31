'use client';

import {useGSAP} from '@gsap/react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Image from 'next/image';
import {useRef} from 'react';
import FeaturesExternal from './FeaturesExternal';

gsap.registerPlugin(ScrollTrigger);

const Features = () => {
  const container = useRef();
  const cardsRef = useRef([]);

  const features = [
    {
      title: 'Air Condition Class room',
      description: 'All our classes are held in air-conditioned classrooms.',
      image: '/assets/image/classroom.jpg',
    },
    {
      title: 'Expert Teachers',
      description: 'All our teachers are highly qualified and experienced.',
      image: '/assets/image/classroom.jpg', // Add your image paths
    },
    {
      title: 'Interactive Learning',
      description: 'Our classes are interactive and engaging.',
      image: '/assets/image/classroom.jpg',
    },
    {
      title: 'Personalized Learning',
      description: 'Our classes are personalized to meet your needs.',
      image: '/assets/image/classroom.jpg',
    },
  ];

  useGSAP(
    () => {
      const cards = cardsRef.current;
      if (cards.length === 0) return;

      const totalScroll = features.length * 500;

      // STEP 1: Create EMPTY timeline FIRST (no ScrollTrigger yet)
      const tl = gsap.timeline();

      // STEP 2: Initial state (before timeline ScrollTrigger)
      gsap.set(
        cards.slice(1).map((c) => c.querySelector('.feature-image')),
        {y: '100%', opacity: 0},
      );
      gsap.set(
        cards.slice(1).map((c) => c.querySelector('.feature-content')),
        {y: '50%', opacity: 0},
      );
      gsap.set(cards[0].querySelectorAll('.feature-image, .feature-content'), {
        y: 0,
        opacity: 1,
      });

      // STEP 3: Build timeline content with labels
      cards.slice(0, -1).forEach((card, index) => {
        const label = `step-${index}`;
        tl.add(label);

        const currentImg = card.querySelector('.feature-image');
        const currentContent = card.querySelector('.feature-content');
        const nextCard = cards[index + 1];
        const nextImg = nextCard.querySelector('.feature-image');
        const nextContent = nextCard.querySelector('.feature-content');

        tl.to(
          [currentImg, currentContent],
          {
            y: '-50%',
            opacity: 0,
            duration: 1.5,
            ease: 'power2.inOut',
          },
          label,
        );

        tl.fromTo(
          nextImg,
          {y: '60%', opacity: 0},
          {
            y: 0,
            opacity: 1,
            duration: 1.8,
            ease: 'power2.out',
          },
          label,
        );

        tl.fromTo(
          nextContent,
          {y: '40%', opacity: 0},
          {
            y: 0,
            opacity: 1,
            duration: 1.8,
            ease: 'power2.out',
          },
          label,
        );

        tl.to({}, {duration: 0.5}, '+=0.2');
      });

      // STEP 4: NOW attach ScrollTrigger to the populated timeline
      ScrollTrigger.create({
        trigger: container.current,
        start: 'top top',
        end: `+=${totalScroll}vh`,
        pin: true,
        pinSpacing: true,
        scrub: 2,
        anticipatePin: 1,
        animation: tl, // Link timeline to pin
        snap: {
          snapTo: tl, // NOW safe: tl exists!
          duration: {min: 0.3, max: 1.5},
          ease: 'power2.inOut',
        },
      });

      // NO need for ScrollTrigger on timeline itself - pin handles it all

      return () => ScrollTrigger.getAll().forEach((t) => t.kill());
    },
    {scope: container},
  );

  return (
    <section
      ref={container}
      className='relative container  mx-auto overflow-hidden'>
      <div className='w-full  px-4 mt-12 mb-12'>
        <div className='text-center mx-auto'>
          <h2 className='font-heading text-3xl sm:text-5xl lg:text-7xl text-cyan-500 tracking-tighter-xl'>
            Features
          </h2>
        </div>
      </div>
      <div className='relative w-full h-[70vh] flex items-center justify-center px-4'>
        <div className='relative w-full h-full'>
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className='feature-card absolute inset-0 w-full h-full py-8 md:py-20 px-4 sm:px-16 bg-gradient-radial-dark border border-gray-900 border-opacity-30 rounded-3xl overflow-hidden flex items-center'>
              <div className='relative z-10 flex flex-wrap items-center w-full h-full'>
                <div className='feature-image relative w-full md:w-1/2 h-full'>
                  <Image
                    className='w-full h-full rounded-3xl object-cover'
                    src={feature.image}
                    alt={feature.title}
                    fill
                    sizes='(max-width: 1440px) 100vw, 50vw'
                    priority={index === 0}
                  />
                </div>
                <div className='feature-content w-full md:w-1/2 flex items-center p-8'>
                  <div className='max-w-xl mx-auto md:mx-0'>
                    <h2 className='mb-6 text-3xl sm:text-6xl text-white tracking-tighter-xl font-bold'>
                      {feature.title}
                    </h2>
                    <p className='px-2 md:px-0 text-white text-opacity-70 text-lg sm:text-xl leading-relaxed'>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='container min-h-20'></div> {/* Space after cards */}
      <div className='px-4 mx-auto py-20'>
        <FeaturesExternal />
      </div>
    </section>
  );
};

export default Features;
