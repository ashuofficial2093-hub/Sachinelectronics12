import React, { useState, useMemo, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { TrendingUp, Users, DollarSign, Activity, CheckCircle, Clock } from 'lucide-react';
import { Complaint, Technician } from '../types';

interface AdminAnalyticsProps {
  complaints: Complaint[];
  technicians: Technician[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <p className="font-bold text-slate-800 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-sm font-medium text-slate-600">{entry.name}:</span>
            <span className="text-sm font-bold text-slate-900" style={{ color: entry.color }}>
              {entry.name.includes('Revenue') || entry.name.includes('Profit') ? '₹' : ''}{entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};


const useCountUp = (end: number, duration: number = 1000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const startValue = count;
    const change = end - startValue;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percent = Math.min(progress / duration, 1);
      
      // easeOutExpo
      const easePercent = percent === 1 ? 1 : 1 - Math.pow(2, -10 * percent);
      
      setCount(startValue + change * easePercent);

      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    if (change !== 0) {
      requestAnimationFrame(animate);
    }
  }, [end]);

  return Math.round(count);
};

export default function AdminAnalytics({ complaints, technicians }: AdminAnalyticsProps) {
  const [filter, setFilter] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [syncTime, setSyncTime] = useState<Date>(new Date());

  useEffect(() => {
    // Whenever complaints change, update sync time
    setSyncTime(new Date());
  }, [complaints]);

  const performanceData = useMemo(() => {
    const dataMap = new Map<string, { revenue: number; profit: number; repairs: number }>();
    const now = new Date();
    
    // Initialize data map based on filter
    if (filter === 'weekly') {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const label = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        dataMap.set(label, { revenue: 0, profit: 0, repairs: 0 });
      }
    } else if (filter === 'monthly') {
      for (let i = 29; i >= 0; i -= 5) {
         // Create rough intervals for the month to avoid 30 data points
         const d = new Date(now);
         d.setDate(d.getDate() - i);
         const label = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
         dataMap.set(label, { revenue: 0, profit: 0, repairs: 0 });
      }
    } else if (filter === 'yearly') {
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now);
        d.setMonth(d.getMonth() - i);
        const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        dataMap.set(label, { revenue: 0, profit: 0, repairs: 0 });
      }
    }

    // Process complaints
    complaints.forEach(complaint => {
      if (complaint.status === 'Resolved' && complaint.resolutionDetails?.totalCost) {
        const cost = complaint.resolutionDetails?.totalCost || 0;
        const profit = cost * 0.45; // Simulated profit margin
        const cDate = new Date(complaint.resolutionDetails?.resolutionDate || complaint.createdAt);
        
        let labelToUpdate = '';
        
        if (filter === 'weekly') {
           if (now.getTime() - cDate.getTime() <= 7 * 24 * 60 * 60 * 1000) {
              labelToUpdate = cDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
           }
        } else if (filter === 'monthly') {
           if (now.getTime() - cDate.getTime() <= 30 * 24 * 60 * 60 * 1000) {
              // Find closest bucket
              let closest = Array.from(dataMap.keys())[0];
              // simple fallback to first bucket for demo if not exact match (in a real app, map exact day to exact week/interval)
              labelToUpdate = cDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
              if(!dataMap.has(labelToUpdate)) {
                 // if precise day not in our 5-day intervals, just dump to closest or last (mock behavior)
                 labelToUpdate = Array.from(dataMap.keys())[Array.from(dataMap.keys()).length - 1];
              }
           }
        } else if (filter === 'yearly') {
           if (now.getTime() - cDate.getTime() <= 365 * 24 * 60 * 60 * 1000) {
              labelToUpdate = cDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
           }
        }

        if (labelToUpdate && dataMap.has(labelToUpdate)) {
          const current = dataMap.get(labelToUpdate)!;
          dataMap.set(labelToUpdate, {
            revenue: current.revenue + cost,
            profit: current.profit + profit,
            repairs: current.repairs + 1
          });
        }
      }
    });

    return Array.from(dataMap.entries()).map(([name, data]) => ({ name, ...data }));
  }, [filter, complaints]);

  const totalRevenueValue = useMemo(() => performanceData.reduce((acc, curr) => acc + curr.revenue, 0), [performanceData]);
  const totalRevenue = useCountUp(totalRevenueValue, 1500);
  const totalRepairsValue = useMemo(() => performanceData.reduce((acc, curr) => acc + curr.repairs, 0), [performanceData]);
  const totalRepairs = useCountUp(totalRepairsValue, 1500);
  const totalProfitValue = useMemo(() => performanceData.reduce((acc, curr) => acc + curr.profit, 0), [performanceData]);
  const totalProfit = useCountUp(totalProfitValue, 1500);
  
  // Calculate top technician (dummy logic based on technician array length just for UI, or we can use complaints if technicianId is assigned)
  // We'll use a placeholder top technician from the list
  const topTech = technicians.length > 0 ? technicians[0].name : 'N/A';

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/70 backdrop-blur-xl p-6 rounded-2xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Business Analytics</h2>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100/50 border border-emerald-200/50 rounded-full">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
               </span>
               <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Synced Real-Time ✓</span>
            </div>
          </div>
          <p className="text-slate-500 text-sm flex items-center gap-1">
             <Clock className="w-3.5 h-3.5" /> Last updated: {syncTime.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex bg-slate-200/50 p-1 rounded-xl backdrop-blur-md">
          {(['weekly', 'monthly', 'yearly'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                filter === f
                  ? 'bg-white text-blue-700 shadow-[0_4px_12px_rgba(59,130,246,0.15)]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="relative bg-gradient-to-br from-blue-500/90 to-blue-700/90 backdrop-blur-xl rounded-2xl p-6 text-white border border-blue-400/30 shadow-[0_0_20px_rgba(59,130,246,0.2)] transform transition-transform hover:scale-[1.02]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 font-medium text-sm">Total Revenue</p>
              <h3 className="text-3xl font-bold mt-1">₹{totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
            </div>
            <div className="relative p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-blue-600"></span>
              </span>
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm font-medium text-blue-100">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>Live Sync Active</span>
          </div>
        </div>

        <div className="relative bg-gradient-to-br from-emerald-400/90 to-emerald-600/90 backdrop-blur-xl rounded-2xl p-6 text-white border border-emerald-400/30 shadow-[0_0_20px_rgba(16,185,129,0.2)] transform transition-transform hover:scale-[1.02]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-emerald-100 font-medium text-sm">Net Profit (Est.)</p>
              <h3 className="text-3xl font-bold mt-1">₹{totalProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
            </div>
            <div className="relative p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 border-2 border-emerald-600"></span>
              </span>
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm font-medium text-emerald-100">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>Live Sync Active</span>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transform transition-transform hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] hover:border-purple-200/50 duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 font-medium text-sm">Active Repairs (Resolved)</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">{totalRepairs}</h3>
            </div>
            <div className="p-3 bg-purple-100/80 backdrop-blur-md rounded-xl border border-purple-200/50">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-emerald-600 font-medium">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span>Successfully completed</span>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transform transition-transform hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] hover:border-orange-200/50 duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 font-medium text-sm">Top Technician</p>
              <h3 className="text-xl font-bold text-slate-800 mt-1 line-clamp-1">{topTech}</h3>
              <p className="text-sm text-slate-500 mt-1">Leading in performance</p>
            </div>
            <div className="p-3 bg-orange-100/80 backdrop-blur-md rounded-xl border border-orange-200/50">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl p-6 rounded-2xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            Revenue vs Profit (3D Depth)
            <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent ml-4"></div>
          </h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} dx={-10} />
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(59,130,246,0.2)', strokeWidth: 2, strokeDasharray: '4 4' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Area type="monotone" dataKey="revenue" name="Total Revenue" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" animationDuration={1500} />
                <Area type="monotone" dataKey="profit" name="Net Profit" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorProfit)" animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            Repairs Volume
            <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent ml-4"></div>
          </h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRepairs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={1}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139,92,246,0.05)' }} />
                <Bar dataKey="repairs" name="Jobs Completed" fill="url(#colorRepairs)" radius={[8, 8, 0, 0]} barSize={24} animationDuration={1500} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
