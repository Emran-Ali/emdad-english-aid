'use client';
import Menu from '@/components/menu';
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
      className="leading-normal tracking-normal bg-cover bg-fixed min-h-screen bg-gradient-radial-dark"
    >
      <ApiProvider>
        <Menu />
        <div className="w-full">
          <div className="max-w-[1444] px-6 md:px-12 py-4">{children}</div>
        </div>
      </ApiProvider>
    </main>
  );
}
