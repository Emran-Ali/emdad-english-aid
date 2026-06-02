'use client';
import Menu from '@/components/Menu';
import Sidebar from '@/components/Sidebar';
import {ApiProvider} from '@emran/Context/APIContext';
import '.././globals.css';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';

export default function RootLayout({children}) {

  const router = useRouter();
  const {data: session, status} = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
          <div
            className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin">
          </div>
        </div>
      </div>
    );
  }

  return (
    <main
      className="leading-normal tracking-normal bg-cover bg-fixed min-h-screen bg-gradient-radial-dark flex"
    >
      <ApiProvider>
        <Menu />
        <Sidebar />
        <div className="flex-1 lg:ml-64 transition-all duration-300">
          <div className="max-w-[1444px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 lg:py-10">
            {children}
          </div>
        </div>
      </ApiProvider>
    </main>
  );
}
