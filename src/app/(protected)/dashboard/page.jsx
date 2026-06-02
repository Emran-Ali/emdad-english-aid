'use client';
import { useSession } from 'next-auth/react';
import { 
  FaUsers, 
  FaChalkboardTeacher, 
  FaStar, 
  FaBookOpen, 
  FaMoneyBillWave, 
  FaGraduationCap 
} from 'react-icons/fa';
import Link from 'next/link';

const StatCard = ({ title, value, icon, color, link }) => (
  <Link href={link || '#'}>
    <div className="bg-cyan-950/40 border border-cyan-800/50 p-6 rounded-3xl hover:bg-cyan-900/40 transition-all duration-300 group cursor-pointer shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-cyan-400 text-sm font-semibold uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white group-hover:scale-105 transition-transform origin-left">{value}</h3>
        </div>
        <div className={`p-4 rounded-2xl ${color} bg-opacity-20 text-2xl group-hover:rotate-12 transition-transform`}>
          {icon}
        </div>
      </div>
    </div>
  </Link>
);

const Page = () => {
  const { data: session } = useSession();
  const role = session?.user?.role;

  return (
    <div className="space-y-10 pb-10">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-cyan-900 to-cyan-950 p-8 rounded-[2rem] border border-cyan-800/50 shadow-2xl">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">{session?.user?.name}</span>!
          </h1>
          <p className="text-cyan-200/70 text-lg">
            Manage your academic activities and stay updated with the latest progress.
          </p>
          <div className="mt-6 flex gap-3">
            <span className="px-4 py-1.5 bg-cyan-700/50 rounded-full text-cyan-100 text-sm font-bold border border-cyan-600/50 uppercase tracking-widest">
              Role: {role}
            </span>
          </div>
        </div>
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Active Students" 
          value="124" 
          icon={<FaUsers />} 
          color="text-blue-400 bg-blue-500"
          link="/student"
        />
        <StatCard 
          title="Running Batches" 
          value="8" 
          icon={<FaChalkboardTeacher />} 
          color="text-green-400 bg-green-500"
          link="/batch"
        />
        <StatCard 
          title="Pending Bookings" 
          value="15" 
          icon={<FaBookOpen />} 
          color="text-yellow-400 bg-yellow-500"
          link="/booking"
        />
        <StatCard 
          title="Student Reviews" 
          value="48" 
          icon={<FaStar />} 
          color="text-purple-400 bg-purple-500"
          link="/reviews"
        />
        <StatCard 
          title="Monthly Expenses" 
          value="45,000 BDT" 
          icon={<FaMoneyBillWave />} 
          color="text-red-400 bg-red-500"
          link="/cost"
        />
        <StatCard 
          title="Success Stories" 
          value="32" 
          icon={<FaGraduationCap />} 
          color="text-cyan-400 bg-cyan-500"
          link="/success-story"
        />
      </div>

      {/* Quick Actions or Recent Activity Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-cyan-950/30 border border-cyan-800/50 p-8 rounded-[2rem]">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-4 p-4 bg-cyan-900/20 rounded-2xl border border-cyan-800/30">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">New student enrolled in "HSC English 2024" batch</p>
                  <p className="text-cyan-400/50 text-xs">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-cyan-950/30 border border-cyan-800/50 p-8 rounded-[2rem]">
          <h2 className="text-2xl font-bold text-white mb-6">System Status</h2>
          <div className="flex items-center justify-between p-6 bg-green-500/10 rounded-2xl border border-green-500/30">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-400 font-bold uppercase tracking-widest text-sm">All Systems Operational</span>
            </div>
            <span className="text-green-400/50 text-xs font-mono">v1.2.4</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
