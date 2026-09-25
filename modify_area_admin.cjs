const fs = require('fs');
let code = fs.readFileSync('src/components/AreaAdminDashboard.tsx', 'utf8');

// 1. Add state for task filter
code = code.replace(/const \[activeTab, setActiveTab\] = useState.*?;/g, `$&
  const [taskFilter, setTaskFilter] = useState<'Active' | 'COMPLETED' | 'All'>('Active');`);

// 2. Add Status filter UI in complaints section
const statusFilterUI = `
                  <div className="flex flex-wrap gap-2 mb-6">
                    <button 
                      onClick={() => setTaskFilter('Active')} 
                      className={\`px-4 py-2 rounded-lg font-bold text-sm transition-colors \${taskFilter === 'Active' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}\`}
                    >
                      🔴 Pending / Active Tasks
                    </button>
                    <button 
                      onClick={() => setTaskFilter('COMPLETED')} 
                      className={\`px-4 py-2 rounded-lg font-bold text-sm transition-colors \${taskFilter === 'COMPLETED' ? 'bg-green-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}\`}
                    >
                      🟢 Completed Tasks
                    </button>
                    <button 
                      onClick={() => setTaskFilter('All')} 
                      className={\`px-4 py-2 rounded-lg font-bold text-sm transition-colors \${taskFilter === 'All' ? 'bg-slate-800 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}\`}
                    >
                      📁 All Complaints History
                    </button>
                  </div>
`;

// Insert the statusFilterUI before the complaints table
code = code.replace(/<table className="w-full text-left border-collapse">/g, `${statusFilterUI}\n                  <table className="w-full text-left border-collapse">`);

// 3. Filter complaints based on taskFilter
// Find: {complaints.map((c) => (
// Replace with: {complaints.filter((c: any) => taskFilter === 'All' ? true : taskFilter === 'Active' ? c.status !== 'COMPLETED' : c.status === 'COMPLETED').map((c) => (
code = code.replace(/\{complaints\.map\(\(c\) => \(/g, 
  `{complaints.filter((c: any) => taskFilter === 'All' ? true : taskFilter === 'Active' ? c.status !== 'COMPLETED' : c.status === 'COMPLETED').map((c) => (`);

// 4. Update the WhatsApp Invoice button in Area Admin
// Let's add it under the Action column for completed complaints
const whatsappButton = `
                                {c.status === "COMPLETED" && (
                                  <a
                                    href={\`https://wa.me/91\${c.mobile}?text=\${encodeURIComponent(\`Hello \${c.name},\\nYour repair ticket \${c.jobCardId || c.id} has been successfully completed!\\n\\n🧾 Total Bill Amount: ₹\${c.resolutionDetails?.totalCost || 0}\\n🛠️ Service: \${c.issue}\\n\\nThank you for choosing Sachin Electronics Sales and Service Center!\`)}\`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="px-3 py-1.5 bg-green-500 text-white font-bold text-xs rounded hover:bg-green-600 flex items-center justify-center whitespace-nowrap"
                                  >
                                    Share Invoice
                                  </a>
                                )}
`;

code = code.replace(/\{c\.status === "COMPLETED" && \([\s\S]*?<\/span>[\s\S]*?<\/div>[\s\S]*?<\/td>/, 
  `$&\n${whatsappButton}`); // Actually let's just insert it into the action cell. The action cell has the Invoice button already maybe? Let's check.

fs.writeFileSync('src/components/AreaAdminDashboard.tsx', code);
console.log("Updated AreaAdminDashboard.tsx");
