import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Zap, Tv, Fan, Lightbulb, ThermometerSun, ShieldAlert, Monitor, Refrigerator } from 'lucide-react';

const APPLIANCES = [
  { id: 'fan', name: 'Ceiling Fan', icon: Fan, watts: 75 },
  { id: 'tube', name: 'Tube Light / Bulb', icon: Lightbulb, watts: 20 },
  { id: 'tv', name: 'Television (LED)', icon: Tv, watts: 100 },
  { id: 'fridge', name: 'Refrigerator', icon: Refrigerator, watts: 250 },
  { id: 'cooler', name: 'Air Cooler', icon: ThermometerSun, watts: 250 },
  { id: 'pc', name: 'Computer/Laptop', icon: Monitor, watts: 150 },
];

export default function LoadCalculator() {
  const [counts, setCounts] = useState<Record<string, number>>({});

  const handleIncrement = (id: string) => {
    setCounts(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleDecrement = (id: string) => {
    setCounts(prev => {
      const current = prev[id] || 0;
      if (current <= 0) return prev;
      return { ...prev, [id]: current - 1 };
    });
  };

  const totalLoad = useMemo(() => {
    return APPLIANCES.reduce((total, app) => {
      return total + (counts[app.id] || 0) * app.watts;
    }, 0);
  }, [counts]);

  const recommendation = useMemo(() => {
    // Add 25% safety margin
    const requiredVA = (totalLoad / 0.8) * 1.25;
    
    if (totalLoad === 0) return null;
    if (requiredVA <= 700) return { inverter: '700 VA - 900 VA', battery: '1 x 150 Ah (12V)' };
    if (requiredVA <= 1200) return { inverter: '1050 VA - 1500 VA', battery: '1 x 200 Ah (12V)' };
    if (requiredVA <= 2000) return { inverter: '2KVA', battery: '2 x 150 Ah (24V)' };
    if (requiredVA <= 3500) return { inverter: '3.5KVA', battery: '4 x 150 Ah (48V)' };
    return { inverter: '5KVA or higher', battery: 'Custom Heavy Duty Setup' };
  }, [totalLoad]);

  return (
    <section id="load-calculator" className="py-20 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm mb-4">
            <Zap className="w-4 h-4" />
            Smart Tool
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Inverter & Battery Load Calculator</h2>
          <p className="text-lg text-slate-600">Select the appliances you want to run during a power cut, and we'll recommend the exact inverter and battery setup you need.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Select Appliances</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {APPLIANCES.map((app) => {
                const Icon = app.icon;
                const count = counts[app.id] || 0;
                return (
                  <div key={app.id} className="border border-slate-200 rounded-xl p-4 flex flex-col items-center text-center hover:border-blue-300 hover:shadow-md transition-all bg-slate-50 hover:bg-blue-50/50">
                    <div className="bg-white p-3 rounded-full shadow-sm mb-3 text-blue-600">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="font-semibold text-slate-800 text-sm">{app.name}</h4>
                    <p className="text-xs text-slate-500 mb-4">{app.watts} Watts each</p>
                    
                    <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-lg p-1 mt-auto w-full justify-between">
                      <button 
                        onClick={() => handleDecrement(app.id)}
                        disabled={count === 0}
                        className="w-8 h-8 flex items-center justify-center rounded bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 transition-colors"
                      >
                        -
                      </button>
                      <span className="font-bold text-slate-900 w-4 text-center">{count}</span>
                      <button 
                        onClick={() => handleIncrement(app.id)}
                        className="w-8 h-8 flex items-center justify-center rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full lg:w-1/3">
            <div className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 p-6 md:p-8 sticky top-24 text-white">
              <h3 className="text-xl font-bold mb-6 border-b border-slate-700 pb-4 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-yellow-400" />
                Your Requirement
              </h3>
              
              <div className="space-y-6">
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">Total Estimated Load</p>
                  <div className="text-3xl font-bold flex items-end gap-1">
                    {totalLoad} <span className="text-lg text-slate-500 font-normal mb-1">Watts</span>
                  </div>
                </div>

                {recommendation ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={totalLoad}
                    className="space-y-4"
                  >
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                      <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Recommended Inverter</p>
                      <p className="text-lg font-bold text-blue-400">{recommendation.inverter}</p>
                      <p className="text-xs text-slate-500 mt-1">Pure Sine Wave Recommended</p>
                    </div>
                    
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                      <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Recommended Battery</p>
                      <p className="text-lg font-bold text-green-400">{recommendation.battery}</p>
                      <p className="text-xs text-slate-500 mt-1">Tubular Battery for long backup</p>
                    </div>
                    
                    <button 
                      onClick={() => {
                        const shopSection = document.getElementById('shop');
                        if (shopSection) {
                          shopSection.scrollIntoView({ behavior: 'smooth' });
                          // Optionally, set search query for inverter
                        }
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl transition-colors mt-4"
                    >
                      Shop Inverters
                    </button>
                  </motion.div>
                ) : (
                  <div className="bg-slate-800 border border-slate-700 border-dashed rounded-xl p-6 text-center text-slate-400">
                    <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Select appliances to see recommendations</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
