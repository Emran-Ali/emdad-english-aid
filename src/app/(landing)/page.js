import Features from '@/components/landing/Features';
import Navbar from '@/components/landing/Navbar';
import Reviews from '@/components/landing/Reviews';
import Welcome from '@/components/landing/Welcome';
import Landing from '@/module/landing/landing';
import SuccessStory from '@/module/landing/SuccessStory';

export default function Home() {
  return (
    <div className="h-full">
      <Navbar />
      <Welcome />
      <Features />
      <Reviews />
      <Landing />
      <SuccessStory />
      <div className="w-full bg-lime-400 rounded-5xl p-6 text-sm text-center md:text-left fade-in">
        <a className="text-gray-500 no-underline hover:no-underline" href="#">
          &copy; Emdad English Aid
        </a>
        - Developed by
        <a
          className="text-gray-500 no-underline hover:no-underline"
          target="_black"
          href="https://www.linkedin.com/in/itsemran/">
          {' '}
          MD Emran Ali
        </a>
      </div>
    </div>
  );
}
