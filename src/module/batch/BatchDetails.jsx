'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BiTime, BiCalendar, BiMoney, BiUser, BiBarChartAlt2 } from 'react-icons/bi';

export default function BatchDetails({ batchId }) {
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (batchId) {
      fetchBatchDetails();
    }
  }, [batchId]);

  const fetchBatchDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/batch?id=${batchId}`);
      setBatch(res.data.data);
    } catch (err) {
      console.error('Failed to fetch batch details', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-cyan-100 p-10 text-center">Loading batch details...</div>;
  if (!batch) return <div className="text-red-400 p-10 text-center">Batch not found.</div>;

  const { analytics } = batch;

  return (
    <div className="space-y-6 text-cyan-100">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-cyan-900/30 p-4 rounded-xl border border-cyan-800/50">
          <h3 className="text-lg font-bold text-cyan-300 mb-3 flex items-center gap-2">
            <BiBarChartAlt2 /> General Information
          </h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-cyan-500 font-semibold">Batch Name:</span> {batch.name}</p>
            <p><span className="text-cyan-500 font-semibold">Batch Code:</span> {batch.batchCode}</p>
            <p><span className="text-cyan-500 font-semibold">Type:</span> {batch.type}</p>
            <p><span className="text-cyan-500 font-semibold">Academic Year:</span> {batch.academicYear}</p>
          </div>
        </div>

        <div className="bg-cyan-900/30 p-4 rounded-xl border border-cyan-800/50">
          <h3 className="text-lg font-bold text-cyan-300 mb-3 flex items-center gap-2">
            <BiTime /> Schedule & Fees
          </h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-cyan-500 font-semibold">Time:</span> {batch.batchTime || 'N/A'}</p>
            <p><span className="text-cyan-500 font-semibold">Fees:</span> ৳{batch.fees}</p>
            <p><span className="text-cyan-500 font-semibold">Start Date:</span> {batch.startDate ? new Date(batch.startDate).toLocaleDateString() : 'N/A'}</p>
            <p><span className="text-cyan-500 font-semibold">End Date:</span> {batch.endDate ? new Date(batch.endDate).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-cyan-900/40 to-cyan-950/60 p-4 rounded-xl border border-cyan-700/30 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-cyan-400 text-xs uppercase tracking-wider font-bold">Total Students</span>
            <BiUser className="text-cyan-400 text-xl" />
          </div>
          <div className="text-2xl font-bold text-white">
            {analytics.totalStudents} <span className="text-xs text-cyan-500 font-normal">/ {batch.maxStudents}</span>
          </div>
          <div className="w-full bg-cyan-950 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-cyan-500 h-full rounded-full transition-all duration-1000" 
              style={{ width: `${Math.min((analytics.totalStudents / batch.maxStudents) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-900/40 to-cyan-950/60 p-4 rounded-xl border border-emerald-700/30 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-emerald-400 text-xs uppercase tracking-wider font-bold">Collected Amount</span>
            <BiMoney className="text-emerald-400 text-xl" />
          </div>
          <div className="text-2xl font-bold text-white">
            ৳{analytics.totalPaid.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-500 mt-1">
            Total Expected: ৳{analytics.totalExpected.toLocaleString()}
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-900/40 to-cyan-950/60 p-4 rounded-xl border border-amber-700/30 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-amber-400 text-xs uppercase tracking-wider font-bold">Total Due</span>
            <BiMoney className="text-amber-400 text-xl" />
          </div>
          <div className="text-2xl font-bold text-white">
            ৳{(analytics.totalExpected - analytics.totalPaid).toLocaleString()}
          </div>
          <div className="text-[10px] text-amber-500 mt-1">
            {analytics.totalExpected > 0 ? Math.round(((analytics.totalExpected - analytics.totalPaid) / analytics.totalExpected) * 100) : 0}% remaining
          </div>
        </div>
      </div>
    </div>
  );
}
