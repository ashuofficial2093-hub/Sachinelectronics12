const fs = require('fs');
let code = fs.readFileSync('src/components/AreaAdminDashboard.tsx', 'utf8');

// We need a state for Leaves
const leavesState = `  const [leaves, setLeaves] = useState<any[]>([]);
  useEffect(() => {
    const loadedLeaves = JSON.parse(localStorage.getItem('app_leaves') || '[]');
    setLeaves(loadedLeaves);
  }, []);
  
  const handleApproveLeave = (id: string, status: 'Approved' | 'Rejected') => {
    const allLeaves = JSON.parse(localStorage.getItem('app_leaves') || '[]');
    const updated = allLeaves.map((l: any) => l.id === id ? { ...l, status } : l);
    localStorage.setItem('app_leaves', JSON.stringify(updated));
    setLeaves(updated);
  };`;

code = code.replace(/const \[activeTab, setActiveTab\] = useState\<'complaints' \| 'technicians' \| 'inventory'\>\('complaints'\);\n\s+const \[invoiceModalOpen, setInvoiceModalOpen\] = useState\(false\);\n\s+const \[selectedInvoiceComplaint, setSelectedInvoiceComplaint\] = useState<any>\(null\);/, 
`const [activeTab, setActiveTab] = useState<'complaints' | 'technicians' | 'inventory'>('complaints');
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [selectedInvoiceComplaint, setSelectedInvoiceComplaint] = useState<any>(null);\n${leavesState}`);

const salaryInfo = `<p className="text-sm text-slate-500 mb-1"><span className="font-semibold">Base Salary:</span> <span className="text-green-600 font-bold">₹{tech.baseSalary || 15000}</span></p>`;
code = code.replace(/<p className="text-sm text-slate-500 mb-4"><span className="font-semibold">Skills:<\/span> \{tech\.specialization \|\| tech\.skills\?\.join\(', '\) \|\| 'N\/A'\}<\/p>/,
`<p className="text-sm text-slate-500 mb-1"><span className="font-semibold">Skills:</span> {tech.specialization || tech.skills?.join(', ') || 'N/A'}</p>\n                            ${salaryInfo}`);

const leaveView = `
        <div className="mt-8 bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200/60 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">🌴 Leave Requests</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200">
                  <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Technician</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Reason</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaves.filter(l => l.status === 'Pending').map(leave => (
                  <tr key={leave.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 text-sm font-medium">{leave.date}</td>
                    <td className="py-3 px-4 text-sm font-bold">{leave.techName}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{leave.reason}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 font-bold text-xs rounded-lg">Pending</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleApproveLeave(leave.id, 'Approved')} className="px-3 py-1.5 bg-green-100 text-green-700 font-bold text-xs rounded-lg hover:bg-green-200 transition-colors">Approve</button>
                        <button onClick={() => handleApproveLeave(leave.id, 'Rejected')} className="px-3 py-1.5 bg-red-100 text-red-700 font-bold text-xs rounded-lg hover:bg-red-200 transition-colors">Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {leaves.filter(l => l.status === 'Pending').length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-500 text-sm">No pending leave requests.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>`;

code = code.replace(/\{activeTab === 'technicians' && \(/, `{activeTab === 'technicians' && (\n        <div className="space-y-6">\n`);
code = code.replace(/\{activeTab === 'inventory' && \(/, `${leaveView}\n        </div>\n        {activeTab === 'inventory' && (`);

fs.writeFileSync('src/components/AreaAdminDashboard.tsx', code);
