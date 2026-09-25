const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

const oldStructure = /<div className="bg-white\/70 backdrop-blur-xl rounded-2xl shadow-\[0_8px_30px_rgb\(0,0,0,0\.04\)\] border border-white\/40 overflow-hidden">[\s\S]*?(?:<\/tbody>\s*<\/table>\s*<\/div>\s*<\/div>)/;

const newStructure = `<div className="space-y-8">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Manage Area Admins</h2>
                <p className="text-sm text-slate-500">Create and manage regional administrators.</p>
              </div>
              <button 
                onClick={() => setAaModal({ isOpen: true, id: '', name: '', email: '', phone: '', password: '', pincodes: '', canEditInventory: true, canAlertTechs: true, canWA: true })}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm"
              >
                + Add New Area Admin
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h3 className="text-lg font-bold text-slate-900">Area Admin Details</h3>
              </div>
              <div className="p-6">
                {areaAdmins.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-500 font-medium">No Area Admins found.</p>
                    <p className="text-sm text-slate-400 mt-1">Click the button above to add your first area admin.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {areaAdmins.map(admin => (
                      <div key={admin.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-5 flex-1">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-bold text-slate-900 text-lg">{admin.name}</h4>
                              <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 mt-1">
                                {admin.isActive !== false ? 'Active' : 'Inactive'}
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <span className="shrink-0 w-5 h-5 flex items-center justify-center bg-slate-100 rounded text-slate-400">📧</span>
                              <span className="truncate">{admin.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <span className="shrink-0 w-5 h-5 flex items-center justify-center bg-slate-100 rounded text-slate-400">📱</span>
                              <span>{admin.phone}</span>
                            </div>
                            <div className="flex gap-2 text-sm text-slate-600 items-start">
                              <span className="shrink-0 w-5 h-5 flex items-center justify-center bg-slate-100 rounded text-slate-400 mt-0.5">📍</span>
                              <div className="flex flex-wrap gap-1">
                                {admin.pincodes && admin.pincodes.map((pin: string) => (
                                  <span key={pin} className="inline-flex px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium border border-slate-200">
                                    {pin}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border-t border-slate-100 bg-slate-50 p-3 flex flex-wrap items-center justify-between gap-2">
                          <button 
                            onClick={() => setViewingAdminComplaints(admin)}
                            className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm"
                          >
                            👁️ View Complaints
                          </button>
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button 
                              onClick={() => {
                                setAaModal({
                                  isOpen: true,
                                  id: admin.id,
                                  name: admin.name,
                                  email: admin.email,
                                  phone: admin.phone,
                                  password: admin.password || '',
                                  pincodes: admin.pincodes ? admin.pincodes.join(', ') : '',
                                  canEditInventory: admin.permissions?.canEditInventory ?? true,
                                  canAlertTechs: admin.permissions?.canAlertTechs ?? true,
                                  canWA: admin.permissions?.canWA ?? true
                                });
                              }}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
                            >
                              ✏️ Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteAdmin(admin.id)}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-red-200 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>`;

if (oldStructure.test(code)) {
    code = code.replace(oldStructure, newStructure);
    fs.writeFileSync('src/components/Admin.tsx', code);
    console.log("Patched Area Admins layout successfully");
} else {
    console.log("Regex didn't match.");
}
