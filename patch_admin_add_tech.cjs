const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

// The user wants:
// 2. BUILD "+ ADD NEW TECHNICIAN" FEATURE:
// Inside the "Pending Techs / Technicians" tab in /super-admin, add a clean "+ Add New Technician" action button and Modal Form with fields:
// Technician Name, Mobile / Phone Number, Assigned Region / PIN Code, Specialization, Status (Active / Inactive toggle)
// Save directly to localStorage key (app_area_techs) and update the list dynamically.

const modalStateCode = `  const [assignModalOpen, setAssignModalOpen] = useState(false);`;
const newModalStateCode = `  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [newTechModalOpen, setNewTechModalOpen] = useState(false);
  const [newTech, setNewTech] = useState({ name: '', mobile: '', pincode: '', skills: '', isActive: true });

  const handleSaveNewTech = (e: React.FormEvent) => {
    e.preventDefault();
    const existing = JSON.parse(localStorage.getItem('app_area_techs') || '[]');
    const newEntry = {
      id: 'local_' + Date.now(),
      name: newTech.name,
      mobile: newTech.mobile,
      phone: newTech.mobile, // for compatibility
      pincodes: [newTech.pincode],
      skills: newTech.skills.split(',').map(s => s.trim()),
      isActive: newTech.isActive,
      role: 'technician',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('app_area_techs', JSON.stringify([...existing, newEntry]));
    setNewTechModalOpen(false);
    setNewTech({ name: '', mobile: '', pincode: '', skills: '', isActive: true });
    // Trigger re-render to fetch local techs
    fetchTechnicians(); 
  };`;

const techAppTabCode = `              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" /> Technician Applications
              </div>`;
              
const newTechAppTabCode = `              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" /> Technician Applications
              </div>
              <button 
                onClick={() => setNewTechModalOpen(true)}
                className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm text-sm"
              >
                + Add New Technician
              </button>`;

const newTechModalHtml = `      {newTechModalOpen && (
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

if (!code.includes('newTechModalOpen')) {
  code = code.replace(modalStateCode, newModalStateCode);
  code = code.replace(techAppTabCode, newTechAppTabCode);
  
  // Insert modal HTML at the end of the return statement, just before the History Modal (or just before {assignModalOpen &&)
  code = code.replace('{assignModalOpen && (', newTechModalHtml + '\\n\\n      {assignModalOpen && (');
  
  fs.writeFileSync('src/components/Admin.tsx', code);
  console.log('Patched Add New Technician modal');
} else {
  console.log('Modal already patched');
}
