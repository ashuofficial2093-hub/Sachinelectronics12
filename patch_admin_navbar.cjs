const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

// Replace "Back to Home" with "🏠 Home Page"
code = code.replace(
  '<span className="hidden sm:inline">Back to Home</span>',
  '<span className="hidden sm:inline">🏠 Home Page</span>'
);

// Replace "Logout" with "🚪 Logout / Exit"
code = code.replace(
  '<span className="hidden sm:inline">Logout</span>',
  '<span className="hidden sm:inline">🚪 Logout / Exit</span>'
);

// Replace <AreaAdminsView /> with the actual inline component for area admins
const areaAdminsJSX = `
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Manage Area Admins</h2>
                <p className="text-sm text-slate-500">Create and manage regional administrators.</p>
              </div>
              <button 
                onClick={() => setAaModal({ isOpen: true, id: '', name: '', email: '', phone: '', password: '', pincodes: '', canEditInventory: true, canAlertTechs: true, canWA: true })}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors"
              >
                + Add New Area Admin
              </button>
            </div>
            <div className="p-6 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-4 py-3 font-bold text-slate-700">Name</th>
                    <th className="px-4 py-3 font-bold text-slate-700">Contact</th>
                    <th className="px-4 py-3 font-bold text-slate-700">Pincodes</th>
                    <th className="px-4 py-3 font-bold text-slate-700 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {areaAdmins.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                        No Area Admins found. Click the button above to add one.
                      </td>
                    </tr>
                  ) : (
                    areaAdmins.map(admin => (
                      <tr key={admin.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-900">{admin.name}</td>
                        <td className="px-4 py-3 text-slate-600">
                          <div>{admin.email}</div>
                          <div className="text-sm">{admin.phone}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {admin.pincodes?.join(', ')}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button 
                            onClick={() => setAaModal({ 
                              isOpen: true, 
                              id: admin.id, 
                              name: admin.name, 
                              email: admin.email, 
                              phone: admin.phone, 
                              password: admin.password || '', 
                              pincodes: (admin.pincodes || []).join(', '), 
                              canEditInventory: admin.permissions?.canEditInventory ?? true, 
                              canAlertTechs: admin.permissions?.canAlertTechs ?? true, 
                              canWA: admin.permissions?.canWA ?? true 
                            })}
                            className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1 bg-blue-50 rounded mr-2"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={async () => {
                              if (confirm('Are you sure you want to delete this Area Admin?')) {
                                try {
                                  const { doc, deleteDoc } = require('firebase/firestore');
                                  await deleteDoc(doc(db, 'areaAdmins', admin.id));
                                  fetchAreaAdmins();
                                } catch(e) { alert('Error deleting'); }
                              }
                            }}
                            className="text-red-600 hover:text-red-800 font-medium px-3 py-1 bg-red-50 rounded"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
`;

if (code.includes("<AreaAdminsView />")) {
  code = code.replace("<AreaAdminsView />", areaAdminsJSX);
}

// Ensure the area admin modal exists in the render method
const aaModalJSX = `
      {aaModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-slate-900 mb-4">{aaModal.id ? 'Edit' : 'Add'} Area Admin</h3>
            <form onSubmit={handleSaveAreaAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input required type="text" value={aaModal.name} onChange={e => setAaModal({...aaModal, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input required type="email" value={aaModal.email} onChange={e => setAaModal({...aaModal, email: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input required type="text" value={aaModal.phone} onChange={e => setAaModal({...aaModal, phone: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input required={!aaModal.id} type="text" value={aaModal.password} onChange={e => setAaModal({...aaModal, password: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md" placeholder={aaModal.id ? "Leave blank to keep current" : ""} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assigned Pincodes (comma-separated)</label>
                <input required type="text" value={aaModal.pincodes} onChange={e => setAaModal({...aaModal, pincodes: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md" placeholder="e.g. 209202, 209203" />
              </div>
              
              <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
                <h4 className="font-medium text-sm text-slate-900">Permissions</h4>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={aaModal.canEditInventory} onChange={e => setAaModal({...aaModal, canEditInventory: e.target.checked})} className="rounded text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-slate-700">Can Edit Local Inventory</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={aaModal.canAlertTechs} onChange={e => setAaModal({...aaModal, canAlertTechs: e.target.checked})} className="rounded text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-slate-700">Can Alert & Assign Technicians</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={aaModal.canWA} onChange={e => setAaModal({...aaModal, canWA: e.target.checked})} className="rounded text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-slate-700">Can Send WhatsApp Updates</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setAaModal({...aaModal, isOpen: false})} className="flex-1 bg-slate-100 text-slate-700 font-bold py-2 px-4 rounded-md hover:bg-slate-200">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700">Save Admin</button>
              </div>
            </form>
          </div>
        </div>
      )}
`;

if (!code.includes("aaModal.isOpen && (")) {
  code = code.replace(
    "{historyModalOpen && (",
    aaModalJSX + "\n      {historyModalOpen && ("
  );
}

fs.writeFileSync('src/components/Admin.tsx', code);
