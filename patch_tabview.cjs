const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

const targetStr = `) : activeTab === 'inventory' ? (`;

const newTabView = `) : activeTab === 'manageTechnicians' ? (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 hover:border-blue-200/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" /> Manage Technicians
                </h2>
                <p className="text-sm text-slate-500">Register, allocate and manage technical staff.</p>
              </div>
              <button 
                onClick={() => setNewTechModalOpen(true)}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm text-sm w-fit flex items-center gap-2"
              >
                + Register & Create Technician ID
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 text-sm border-y border-slate-200">
                    <th className="py-4 px-6 font-semibold">Tech ID & Name</th>
                    <th className="py-4 px-6 font-semibold">Contact</th>
                    <th className="py-4 px-6 font-semibold">Login Credentials</th>
                    <th className="py-4 px-6 font-semibold">Area / PIN</th>
                    <th className="py-4 px-6 font-semibold">Status</th>
                    <th className="py-4 px-6 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {technicians.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">No active technicians registered yet.</td>
                    </tr>
                  ) : (
                    technicians.map((tech) => (
                      <tr key={tech.id || tech.phone} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-900">{tech.name}</div>
                          <div className="text-xs text-slate-500 font-mono mt-0.5">{tech.id}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-slate-700">{tech.phone || tech.mobile}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm">
                            <span className="font-medium text-slate-700">ID:</span> <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-xs">{tech.loginId || 'N/A'}</span>
                          </div>
                          <div className="text-sm mt-1">
                            <span className="font-medium text-slate-700">Pass:</span> <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-xs">{tech.password || '***'}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-slate-700">
                            {tech.areaAdminId ? (
                              <span className="inline-flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span> 
                                {areaAdmins.find(a => a.id === tech.areaAdminId)?.name || tech.areaAdminId}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">Unassigned</span>
                            )}
                          </div>
                          {tech.pincodes && tech.pincodes.length > 0 && (
                            <div className="text-xs text-slate-500 mt-1">{tech.pincodes.join(', ')}</div>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <span className={\`inline-flex px-2.5 py-1 rounded-full text-xs font-bold uppercase \${tech.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}\`}>
                            {tech.isActive !== false ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
                              ✏️
                            </button>
                            <button 
                              onClick={() => {
                                if(confirm('Are you sure you want to delete this technician?')) {
                                  // Implementation for deletion
                                  const existing = JSON.parse(localStorage.getItem('app_area_techs') || '[]');
                                  const updated = existing.filter(t => t.id !== tech.id && t.phone !== tech.phone);
                                  localStorage.setItem('app_area_techs', JSON.stringify(updated));
                                  setTechnicians(prev => prev.filter(t => t.id !== tech.id && t.phone !== tech.phone));
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'inventory' ? (`;

code = code.replace(targetStr, newTabView);
fs.writeFileSync('src/components/Admin.tsx', code);
console.log('Patched main view');
