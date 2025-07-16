import dynamic from 'next/dynamic';

const BatchList = dynamic(() => import('@/module/batch/index'), {ssr: false});

export default function Home() {
  return <BatchList />;
}
