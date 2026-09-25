const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

if (!code.includes("const [assignModalOpen")) {
  code = code.replace(
    "const [historyPhone, setHistoryPhone] = useState('');",
    "const [historyPhone, setHistoryPhone] = useState('');\n  const [assignModalOpen, setAssignModalOpen] = useState(false);\n  const [assigningComplaintId, setAssigningComplaintId] = useState<string | null>(null);\n  const [selectedTechId, setSelectedTechId] = useState('');"
  );
}

if (!code.includes("const handleOpenAssignModal")) {
  code = code.replace(
    "const handleUpdateCustomStatus",
    "const handleOpenAssignModal = (id: string) => {\n    setAssigningComplaintId(id);\n    setSelectedTechId('');\n    setAssignModalOpen(true);\n  };\n\n  const handleUpdateCustomStatus"
  );
}

const assignModalJsx = `
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Assign Technician</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Technician</label>
                <select 
                  value={selectedTechId}
                  onChange={e => setSelectedTechId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-0 focus:border-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all bg-white"
                >
                  <option value="">-- Choose a Technician --</option>
                  {technicians.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.phone})</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setAssignModalOpen(false)}
                  className="flex-1 bg-slate-100 text-slate-700 font-bold py-2 px-4 rounded-md hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    if (assigningComplaintId && selectedTechId) {
                      handleAssignTechnician(assigningComplaintId, selectedTechId);
                      setAssignModalOpen(false);
                    } else {
                      alert('Please select a technician');
                    }
                  }}
                  className="flex-1 bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
`;

if (!code.includes("assignModalOpen && (")) {
  code = code.replace(
    "{historyModalOpen && (",
    assignModalJsx + "\n      {historyModalOpen && ("
  );
}

fs.writeFileSync('src/components/Admin.tsx', code);
