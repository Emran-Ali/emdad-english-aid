import dynamic from 'next/dynamic';

const BatchList = dynamic(() => import('@/module/Batch/index'), { ssr: false });

export default function Home() {
    return (
        <BatchList />
    );
}
