const fs = require('fs');

let code = fs.readFileSync('src/components/AreaAdminDashboard.tsx', 'utf8');

// 1. Remove duplicate leaves states (lines 29-41 roughly)
// We'll search for the second occurrence of invoiceModalOpen and remove it and the adjacent leaves states.
const dupRegex = /const \[invoiceModalOpen, setInvoiceModalOpen\] = useState\(false\);\s*const \[selectedInvoiceComplaint, setSelectedInvoiceComplaint\] = useState<any>\(null\);\s*const \[leaves, setLeaves\] = useState<any\[\]>\(\[\]\);\s*useEffect\(\(\) => \{\s*const loadedLeaves = JSON\.parse\(localStorage\.getItem\('app_leaves'\) \|\| '\[\]'\);\s*setLeaves\(loadedLeaves\);\s*\}, \[\]\);\s*const handleApproveLeave = \(id: string, status: 'Approved' \| 'Rejected'\) => \{\s*const allLeaves = JSON\.parse\(localStorage\.getItem\('app_leaves'\) \|\| '\[\]'\);\s*const updated = allLeaves\.map\(\(l: any\) => l\.id === id \? \{ \.\.\.l, status \} : l\);\s*localStorage\.setItem\('app_leaves', JSON\.stringify\(updated\)\);\s*setLeaves\(updated\);\s*\};\s*/;

code = code.replace(dupRegex, '');

// 2. Fix the syntax error at line 395 and below
// I'll manually locate the leaveView JSX block and ensure it's structured properly.
// The easiest way is to match `)}` followed by `<div className="mt-8 bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200/60 p-6">`
// up to `{activeTab === 'inventory' && (`
// and wrap them cleanly.

// Actually, I might have messed up the `</div>` counts so badly that the safest thing is to find `<main className="flex-1">` and its end, and just use a fresh copy if it's too bad.
// Let's first try to match the exact problematic area.

let area = code.substring(code.indexOf('              </div>\n            </div>\n          )}'), code.indexOf('{activeTab === \'inventory\' && ('));

// We want it to be exactly:
//               </div>
//             </div>
//           )}
//           <div className="mt-8 ... leaveView ... </div>
//           

// Let's just remove the `}` causing issue `394|                </div>\n395|              </div>\n396|            )}\n` 
// wait, the error said `The character "}" is not valid inside a JSX element`.
// That means the closing `)}` was interpreted as text because the `{activeTab === 'technicians' && (` block was already closed!
// Where was it closed?
// Let's replace the whole `leaveView` insertion with a clean one.

const cleanBlock = code.replace(/<\/div>\s*<\/div>\s*<\/div>\s*\)\}\s*<div className="mt-8 bg-white\/70 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200\/60 p-6">[\s\S]*?No pending leave requests\.<\/td>\s*<\/tr>\s*\)\}\s*<\/tbody>\s*<\/table>\s*<\/div>\s*<\/div>\s*<\/div>\s*\{activeTab === 'inventory' && \(/, 
`</div>
              </div>
            </div>
          )}

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
          </div>
          {activeTab === 'inventory' && (`);

fs.writeFileSync('src/components/AreaAdminDashboard.tsx', cleanBlock);
