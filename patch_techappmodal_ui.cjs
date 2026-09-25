const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

const oldModalUI = `<div className="mb-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Optional Reason / Note</label>
                    <textarea
                      value={techAppModal.reason}
                      onChange={(e) => setTechAppModal({...techAppModal, reason: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      placeholder="e.g. Approved for AC repairs. Need to re-submit DL. etc."
                    ></textarea>
                    <p className="text-xs text-slate-400 mt-1">This will be included in the WhatsApp notification.</p>
                  </div>`;

const newModalUI = `{techAppModal.action === 'Approved' ? (
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Generate Login ID</label>
                        <input
                          type="text"
                          required
                          value={techAppModal.loginId}
                          onChange={(e) => setTechAppModal({...techAppModal, loginId: e.target.value})}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Create Account Password</label>
                        <input
                          type="text"
                          required
                          value={techAppModal.password}
                          onChange={(e) => setTechAppModal({...techAppModal, password: e.target.value})}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Assign Area Admin</label>
                        <select
                          required
                          value={techAppModal.areaAdminId}
                          onChange={(e) => setTechAppModal({...techAppModal, areaAdminId: e.target.value})}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        >
                          <option value="">-- Select Area Admin --</option>
                          {areaAdmins.map(admin => (
                            <option key={admin.id} value={admin.id}>{admin.name} ({admin.pincodes ? admin.pincodes.join(', ') : 'All Areas'})</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Optional Reason / Note</label>
                      <textarea
                        value={techAppModal.reason}
                        onChange={(e) => setTechAppModal({...techAppModal, reason: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                        placeholder="e.g. Approved for AC repairs. Need to re-submit DL. etc."
                      ></textarea>
                      <p className="text-xs text-slate-400 mt-1">This will be included in the WhatsApp notification.</p>
                    </div>
                  )}`;

if (code.includes('Optional Reason / Note')) {
  code = code.replace(oldModalUI, newModalUI);
  fs.writeFileSync('src/components/Admin.tsx', code);
  console.log('Patched techAppModal UI');
} else {
  console.log('Could not find modal UI text');
}
