const fs = require('fs');
let code = fs.readFileSync('src/components/AreaAdminDashboard.tsx', 'utf8');

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

// Note: AreaAdminDashboard had invoice additions applied manually before (which git checkout might revert). 
// Wait, git checkout will revert the invoice addition for AreaAdminDashboard! I must re-apply both invoice and leaves.

code = code.replace(/import \{ LogOut, Package, Users, FileText, CheckCircle, Clock \} from 'lucide-react';/,
`import { LogOut, Package, Users, FileText, CheckCircle, Clock, FileText as FileTextIcon } from 'lucide-react';\nimport InvoiceGeneratorModal from './InvoiceGeneratorModal';`);

code = code.replace(/const \[activeTab, setActiveTab\] = useState\<'complaints' \| 'technicians' \| 'inventory'\>\('complaints'\);/,
`const [activeTab, setActiveTab] = useState<'complaints' | 'technicians' | 'inventory'>('complaints');
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [selectedInvoiceComplaint, setSelectedInvoiceComplaint] = useState<any>(null);\n${leavesState}`);

const actionInjection = `
                                    <button 
                                      onClick={() => { setSelectedInvoiceComplaint(c); setInvoiceModalOpen(true); }}
                                      className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 font-bold rounded-lg text-sm hover:bg-blue-100 transition-colors"
                                    >
                                      <FileTextIcon className="w-4 h-4" /> Gen Invoice
                                    </button>`;
                                    
code = code.replace(/💬 WhatsApp Customer\n\s+<\/a>/, `💬 WhatsApp Customer\n                                    </a>${actionInjection}`);

const modalRender = `{invoiceModalOpen && selectedInvoiceComplaint && (
        <InvoiceGeneratorModal 
          complaint={selectedInvoiceComplaint} 
          onClose={() => { setInvoiceModalOpen(false); setSelectedInvoiceComplaint(null); }} 
        />
      )}`;
      
code = code.replace(/<\/div>\n    <\/div>\n  \);\n\}\n$/, `${modalRender}\n      </div>\n    </div>\n  );\n}\n`);

// Base Salary Display
const salaryInfo = `<p className="text-sm text-slate-500 mb-1"><span className="font-semibold">Base Salary:</span> <span className="text-green-600 font-bold">₹{tech.baseSalary || 15000}</span></p>`;
code = code.replace(/<div className="text-sm text-slate-500">\{tech\.phone\}<\/div>/,
`<div className="text-sm text-slate-500">{tech.phone}</div>\n                          ${salaryInfo}`);

// Leaves Render
const leaveView = `
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-lg">🌴 Leave Requests</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
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

// Insert leaveView right before the closing div of the `technicians` tab
// The structure is:
// {activeTab === 'technicians' && (
//   <div className="space-y-6">
//     ...
//   </div>
// )}
// We can find `{activeTab === 'inventory' && (` and insert before it, closing the technicians tab space-y-6 cleanly
// Actually, it's safer to just replace `                  )}` (for technicians map) and `                </div>` `              </div>` `            </div>` `          )}`
code = code.replace(/<\/div>\n\s+<\/div>\n\s+<\/div>\n\s+\)}\n\s+\{activeTab === 'inventory' && \(/, 
`</div>\n              </div>\n${leaveView}\n            </div>\n          )}\n\n          {activeTab === 'inventory' && (`);

fs.writeFileSync('src/components/AreaAdminDashboard.tsx', code);
