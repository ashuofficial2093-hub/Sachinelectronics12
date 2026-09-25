const fs = require('fs');
let code = fs.readFileSync('src/components/TechnicianDashboard.tsx', 'utf8');

// 1. Add state for task filter
code = code.replace(/const \[activeTab, setActiveTab\] = useState.*?;/g, `$&
  const [taskFilter, setTaskFilter] = useState<'Active' | 'COMPLETED' | 'All'>('Active');`);

// 2. Add WhatsApp Invoice button for COMPLETED complaints and Status filter UI
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

// Insert the statusFilterUI before the complaints grid
code = code.replace(/<div className="grid grid-cols-1 md:grid-cols-2 gap-4">/g, `${statusFilterUI}\n            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">`);

// 3. Filter complaints based on taskFilter
// Find: {complaints.map((complaint: any) => (
// Replace with: {complaints.filter((c: any) => taskFilter === 'All' ? true : taskFilter === 'Active' ? c.status !== 'COMPLETED' : c.status === 'COMPLETED').map((complaint: any) => (

code = code.replace(/\{complaints\.map\(\(complaint: any\) => \(/g, 
  `{complaints.filter((c: any) => taskFilter === 'All' ? true : taskFilter === 'Active' ? c.status !== 'COMPLETED' : c.status === 'COMPLETED').map((complaint: any) => (`);

// 4. Update the WhatsApp Invoice button
// We'll find where {complaint.status === 'COMPLETED' && complaint.resolutionDetails && (...)} is rendered and add the button inside.
const whatsappButton = `
                      <a 
                        href={\`https://wa.me/91\${complaint.mobile}?text=\${encodeURIComponent(\`Hello \${complaint.name},\\nYour repair ticket \${complaint.jobCardId || complaint.id} has been successfully completed!\\n\\n🧾 Total Bill Amount: ₹\${complaint.resolutionDetails?.totalCost || 0}\\n🛠️ Service: \${complaint.issue}\\n\\nThank you for choosing Sachin Electronics Sales and Service Center!\`)}\`}
                        target="_blank" rel="noopener noreferrer"
                        className="w-full mt-4 flex justify-center items-center gap-2 bg-green-500 text-white py-2 px-4 rounded-lg font-bold hover:bg-green-600 transition-colors"
                      >
                        💬 Share Invoice on WhatsApp
                      </a>
`;

code = code.replace(/<p className="text-xs font-bold text-green-800 mb-1">Resolved Successfully<\/p>[\s\S]*?<\/div>/, 
  `$&${whatsappButton}`);

// 5. Fix app_complaints persistence in handleResolveComplaint
code = code.replace(/if \(tech && tech\.id\) \{/g, `
      // Update local storage directly to persist completed
      const localComplaints = JSON.parse(localStorage.getItem('app_complaints') || '[]');
      const compIndex = localComplaints.findIndex((c: any) => c.id === resolvingComplaintId);
      if (compIndex >= 0) {
        localComplaints[compIndex].status = 'COMPLETED';
        localComplaints[compIndex].resolutionDetails = {
          totalCost: Number(totalCost),
          resolutionDate: new Date().toISOString()
        };
        localStorage.setItem('app_complaints', JSON.stringify(localComplaints));
      }
      
      if (tech && tech.id) {`);

fs.writeFileSync('src/components/TechnicianDashboard.tsx', code);
console.log("Updated TechnicianDashboard.tsx");
