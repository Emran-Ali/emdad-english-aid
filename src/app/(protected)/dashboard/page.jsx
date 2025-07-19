'use client';
import {useSession, signOut} from 'next-auth/react';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';

const Page = () => {
  const {data: session, status} = useSession();
  // const router = useRouter();
  //
  // useEffect(() => {
  //   if (status === 'unauthenticated') {
  //     router.push('/signin');
  //   }
  // }, [status, router]);
  //
  //
  // if (status === 'loading') {
  //   return (
  //     <div className="relative flex justify-center items-center min-h-screen bg-white">
  //       <div
  //         className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500"></div>
  //       <img src="https://www.svgrepo.com/show/509001/avatar-thinking-9.svg"
  //            className="rounded-full h-28 w-28" />
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-full">
      <div className="mx-auto">
        <h1>Welcome, {session?.user?.name}</h1>
        <p>Role: {session?.user?.role}</p>
        <button onClick={() => signOut()}>Sign Out</button>
      </div>
    </div>
  );
};

export default Page;
