import Features from '@/components/landing/Features';
import Navbar from '@/components/landing/Navbar';
import Reviews from '@/components/landing/Reviews';
import Welcome from '@/components/landing/Welcome';
import Landing from '@/module/landing/landing';
import SuccessStory from '@/module/landing/SuccessStory';
import Team from '@/module/landing/Team';
import BatchBooking from '@/module/landing/BatchBooking';
import Footer from '@emran/Components/Footer';

export default function Home() {
  return (
    <div className='h-full'>
      <Navbar />
      <Welcome />
      <Features />
      <BatchBooking />
      <Reviews />
      <SuccessStory />
      <Team />
      <Landing />
      <Footer />
    </div>
  );
}
