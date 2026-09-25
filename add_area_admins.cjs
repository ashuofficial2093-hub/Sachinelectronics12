const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

const functionsStr = `
  const handleSaveAreaAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const pins = aaModal.pincodes.split(',').map(s => s.trim()).filter(s => s);
      const data = {
        name: aaModal.name,
        email: aaModal.email,
        phone: aaModal.phone,
        password: aaModal.password, // Ideally hashed, but cleartext for MVP requirement
        pincodes: pins,
        isActive: true,
        permissions: {
          canEditInventory: aaModal.canEditInventory,
          canAlertTechs: aaModal.canAlertTechs,
          canWA: aaModal.canWA
        }
      };

      if (aaModal.id) {
        await updateDoc(doc(db, 'areaAdmins', aaModal.id), data);
      } else {
        await addDoc(areaAdminsCollection, data);
      }
      setAaModal({ isOpen: false, id: '', name: '', email: '', phone: '', password: '', pincodes: '', canEditInventory: true, canAlertTechs: true, canWA: true });
      fetchAreaAdmins();
      setToastMessage("Area Admin Saved Successfully");
      setTimeout(() => setToastMessage(''), 3000);
    } catch (e) {
      console.error(e);
      alert("Error saving Area Admin");
    }
  };

  const handleToggleAreaAdminStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'areaAdmins', id), { isActive: !currentStatus });
      fetchAreaAdmins();
    } catch (e) { console.error(e); }
  };
`;

code = code.replace(
  "const handleSaveInventory = async (e: React.FormEvent) => {",
  functionsStr + "\n  const handleSaveInventory = async (e: React.FormEvent) => {"
);

const areaAdminTabUI = `
        ) : activeTab === 'areaAdmins' && user?.role === 'super_admin' ? (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" /> Area Admins
              </h2>
              <button onClick={() => setAaModal({ ...aaModal, isOpen: true, id: '' })} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm">
                <Plus className="w-4 h-4" /> Add Regional Manager
              </button>
            </div>
            <div className="p-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Pincodes</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {areaAdmins.map(admin => (
                    <tr key={admin.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">{admin.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{admin.phone}<br/>{admin.email}</td>
                      <td className="px-4 py-3 text-sm text-slate-500 max-w-xs truncate">{admin.pincodes.join(', ')}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={\`px-2 py-1 rounded-full text-xs font-medium \${admin.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}\`}>
                          {admin.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-right flex justify-end gap-2">
                        <button onClick={() => setAaModal({ isOpen: true, id: admin.id, name: admin.name, email: admin.email, phone: admin.phone, password: admin.password, pincodes: admin.pincodes.join(', '), canEditInventory: admin.permissions?.canEditInventory ?? true, canAlertTechs: admin.permissions?.canAlertTechs ?? true, canWA: admin.permissions?.canWA ?? true })} className="text-blue-600 hover:text-blue-900 p-1">Edit</button>
                        <button onClick={() => handleToggleAreaAdminStatus(admin.id, admin.isActive)} className={\`p-1 \${admin.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}\`}>{admin.isActive ? 'Suspend' : 'Activate'}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {areaAdmins.length === 0 && (
                <div className="text-center text-slate-500 py-8">No Area Admins found.</div>
              )}
            </div>

            {aaModal.isOpen && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
                  <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-lg">{aaModal.id ? 'Edit' : 'Add'} Area Admin</h3>
                    <button onClick={() => setAaModal({...aaModal, isOpen: false})} className="text-slate-400 hover:text-slate-600">×</button>
                  </div>
                  <form onSubmit={handleSaveAreaAdmin} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                        <input required type="text" value={aaModal.name} onChange={e=>setAaModal({...aaModal, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email (Login ID)</label>
                        <input required type="email" value={aaModal.email} onChange={e=>setAaModal({...aaModal, email: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                        <input required type="tel" value={aaModal.phone} onChange={e=>setAaModal({...aaModal, phone: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input required={!aaModal.id} type="text" value={aaModal.password} onChange={e=>setAaModal({...aaModal, password: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Assigned Pincodes (Comma separated)</label>
                        <input required type="text" value={aaModal.pincodes} onChange={e=>setAaModal({...aaModal, pincodes: e.target.value})} placeholder="e.g. 209202, 208001" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500" />
                      </div>
                    </div>
                    
                    <h4 className="font-bold text-sm text-slate-700 mb-3 border-b pb-2 mt-6">Granular Permissions</h4>
                    <div className="space-y-3 mb-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={aaModal.canEditInventory} onChange={e=>setAaModal({...aaModal, canEditInventory: e.target.checked})} className="w-4 h-4 text-blue-600 rounded" />
                        <span className="text-sm font-medium text-slate-700">Can Edit Local Spare Part Inventory</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={aaModal.canAlertTechs} onChange={e=>setAaModal({...aaModal, canAlertTechs: e.target.checked})} className="w-4 h-4 text-blue-600 rounded" />
                        <span className="text-sm font-medium text-slate-700">Can Alert / Dispatch Technicians</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={aaModal.canWA} onChange={e=>setAaModal({...aaModal, canWA: e.target.checked})} className="w-4 h-4 text-blue-600 rounded" />
                        <span className="text-sm font-medium text-slate-700">Allow Customer WhatsApp Redirects</span>
                      </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                      <button type="button" onClick={() => setAaModal({...aaModal, isOpen: false})} className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition-colors">Cancel</button>
                      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">Save Admin</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
`;

code = code.replace(
  "        ) : activeTab === 'pricing' ? (",
  areaAdminTabUI + "\n        ) : activeTab === 'pricing' ? ("
);

fs.writeFileSync('src/components/Admin.tsx', code);
