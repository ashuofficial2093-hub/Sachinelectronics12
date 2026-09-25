import React, { useState } from 'react';
import { UserRole } from '../../types';
import { Shield, Plus, MapPin } from 'lucide-react';

export default function AreaAdminsView() {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Manage Area Admins</h2>
          <p className="text-sm text-slate-500">Create and manage regional administrators.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add Area Admin
        </button>
      </div>
      <div className="p-6">
        <div className="border border-blue-200 bg-blue-50 rounded-xl p-6 text-center text-blue-800">
          <Shield className="w-12 h-12 mx-auto mb-3 text-blue-400 opacity-50" />
          <h3 className="font-bold text-lg mb-2">Area Admins Database Connected</h3>
          <p className="text-sm">Regional administrators will appear here once created. Currently using the mock <strong>bilhaur@app.com</strong> credential for testing.</p>
        </div>
      </div>
    </div>
  );
}
