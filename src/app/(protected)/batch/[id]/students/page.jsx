'use client';
import BatchStudentModule from '@/module/batch/BatchStudentModule';
import { useParams } from 'next/navigation';

export default function Page() {
  const params = useParams();
  const { id } = params;

  return (
    <div className="p-4 md:p-10">
      <BatchStudentModule batchId={id} />
    </div>
  );
}
