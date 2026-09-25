const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

const oldModal = `{newTechModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Add New Technician</h3>
            <form onSubmit={handleSaveNewTech} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Technician Name</label>
                <input required type="text" value={newTech.name} onChange={e => setNewTech({...newTech, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-0 focus:border-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all bg-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mobile / Phone Number</label>
                <input required type="text" value={newTech.mobile} onChange={e => setNewTech({...newTech, mobile: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-0 focus:border-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all bg-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assigned Region / PIN Code</label>
                <input required type="text" value={newTech.pincode} onChange={e => setNewTech({...newTech, pincode: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-0 focus:border-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all bg-white" placeholder="e.g. 209202" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Specialization (Comma separated)</label>
                <input required type="text" value={newTech.skills} onChange={e => setNewTech({...newTech, skills: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-0 focus:border-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all bg-white" placeholder="e.g. AC Repair, Electricals" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={newTech.isActive} onChange={e => setNewTech({...newTech, isActive: e.target.checked})} className="rounded text-blue-600 focus:ring-blue-500" />
                <label className="text-sm font-medium text-slate-700">Active Status</label>
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setNewTechModalOpen(false)} className="flex-1 bg-slate-100 text-slate-700 font-bold py-2 px-4 rounded-md hover:bg-slate-200 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">Save Technician</button>
              </div>
            </form>
          </div>
        </div>
      )}`;

const newModal = `{newTechModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Register & Create Technician ID</h3>
            <form onSubmit={handleSaveNewTech} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">👤 Technician Full Name</label>
                  <input required type="text" value={newTech.name} onChange={e => setNewTech({...newTech, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-0 focus:border-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">📱 Mobile / Phone Number</label>
                  <input required type="text" value={newTech.mobile} onChange={e => setNewTech({...newTech, mobile: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-0 focus:border-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all bg-white" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-1">🆔 Unique Login ID</label>
                  <input required type="text" value={newTech.loginId} onChange={e => setNewTech({...newTech, loginId: e.target.value})} className="w-full px-3 py-2 border border-blue-200 rounded-md focus:ring-0 focus:border-blue-400 transition-all bg-white" placeholder="e.g. TECH_208001" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-1">🔑 Account Password</label>
                  <input required type="text" value={newTech.password} onChange={e => setNewTech({...newTech, password: e.target.value})} className="w-full px-3 py-2 border border-blue-200 rounded-md focus:ring-0 focus:border-blue-400 transition-all bg-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">📍 Assigned Area PIN Code</label>
                  <input required type="text" value={newTech.pincode} onChange={e => setNewTech({...newTech, pincode: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-0 focus:border-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all bg-white" placeholder="e.g. 209202" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">🛠️ Specialization / Service</label>
                  <input required type="text" value={newTech.skills} onChange={e => setNewTech({...newTech, skills: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-0 focus:border-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all bg-white" placeholder="e.g. AC Repair, Electricals" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">🏛️ Link to Area Admin</label>
                <select 
                  required 
                  value={newTech.areaAdminId} 
                  onChange={e => setNewTech({...newTech, areaAdminId: e.target.value})} 
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-0 focus:border-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all bg-white"
                >
                  <option value="">-- Select Area Admin --</option>
                  {areaAdmins.map(admin => (
                    <option key={admin.id} value={admin.id}>{admin.name} ({admin.pincodes ? admin.pincodes.join(', ') : 'All Areas'})</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" checked={newTech.isActive} onChange={e => setNewTech({...newTech, isActive: e.target.checked})} className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4" />
                <label className="text-sm font-medium text-slate-700">Active Status</label>
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setNewTechModalOpen(false)} className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 px-4 rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors">Create Technician</button>
              </div>
            </form>
          </div>
        </div>
      )}`;

if (code.includes('Add New Technician')) {
  // Let's replace the whole string by finding the start and end precisely.
  // Actually, replacing string may have spacing issues. We can just use split and join on a smaller chunk.
  
  const startChunk = '{newTechModalOpen && (';
  let startIndex = code.indexOf(startChunk);
  
  if (startIndex > -1) {
    let endIndex = code.indexOf(')}', startIndex + 100);
    // Find the next History Modal comment to be safe
    let nextComment = code.indexOf('{/* History Modal */}', startIndex);
    if (nextComment > -1) {
       endIndex = nextComment;
    }
    code = code.substring(0, startIndex) + newModal + "\n      " + code.substring(endIndex);
    fs.writeFileSync('src/components/Admin.tsx', code);
    console.log('Patched modal successfully');
  }
}
