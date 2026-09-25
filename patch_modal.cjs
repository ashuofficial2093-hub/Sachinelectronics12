const fs = require('fs');
let content = fs.readFileSync('src/components/TechnicianDashboard.tsx', 'utf8');

const target = `      {/* Resolution Modal */}`;

const replacement = `      {/* Remark Modal */}
      {remarkModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Report Issue / Remark</h3>
              <form onSubmit={handleSaveRemark} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Remark / Reason</label>
                  <textarea
                    required
                    value={technicianRemark}
                    onChange={(e) => setTechnicianRemark(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition-all resize-none h-32"
                    placeholder="Enter reason or missing part details (e.g., Part not in inventory, motor faulty, customer unavailable)"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
                  <select
                    value={remarkStatus}
                    onChange={(e) => setRemarkStatus(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
                  >
                    <option value="Pending - Part Required">Pending - Part Required</option>
                    <option value="In Progress">In Progress</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setRemarkModalOpen(false);
                      setRemarkingComplaintId(null);
                      setTechnicianRemark('');
                    }}
                    className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 px-4 rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-yellow-500 text-white font-bold py-3 px-4 rounded-xl hover:bg-yellow-600 transition-colors"
                  >
                    Save Remark
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Resolution Modal */}`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/TechnicianDashboard.tsx', content);
