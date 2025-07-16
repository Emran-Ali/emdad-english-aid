'use client';

import {useEffect} from 'react';
import {useRouter} from 'next/navigation'; // <-- use next/navigation
import {useJWTAuth} from '@auth/AuthProvider';

export default function AuthGuard({children}) {
  const router = useRouter();
  const {isAuthenticated, isLoading} = useJWTAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, isLoading, router]);

  return <>
    {isLoading && <div>Loading...</div>}
    {!isLoading && children}
  </>;
}