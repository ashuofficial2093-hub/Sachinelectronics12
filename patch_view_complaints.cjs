const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

// Add state for viewing admin complaints
if (!code.includes("const [viewingAdminComplaints")) {
  code = code.replace(
    "const [areaAdmins, setAreaAdmins] = useState<any[]>([]);",
    "const [areaAdmins, setAreaAdmins] = useState<any[]>([]);\n  const [viewingAdminComplaints, setViewingAdminComplaints] = useState<any>(null);"
  );
}

// Update the actions column in the areaAdmins map
const oldActionsCellRegex = /<td className="px-4 py-3 text-right">[\s\S]*?<\/td>/g;
let matchCount = 0;
code = code.replace(oldActionsCellRegex, (match) => {
  matchCount++;
  if (matchCount === 2) { // The second <td> is for the mapping (first is header, wait, header is <th>)
    // Ah, wait. Let's just find the exact map string
    return match;
  }
  return match;
});

const mapRegex = /(<tr key=\{admin\.id\}.*?>[\s\S]*?<td className="px-4 py-3 text-right">)([\s\S]*?)(<\/td>\s*<\/tr>)/;
code = code.replace(mapRegex, (fullMatch, p1, p2, p3) => {
  const newButton = `
                          <button 
                            onClick={() => setViewingAdminComplaints(admin)}
                            className="text-green-600 hover:text-green-800 font-medium px-3 py-1 bg-green-50 rounded mr-2"
                          >
                            👁️ View Area Complaints
                          </button>
  `;
  
  // also fix delete button
  const newDelete = `
                          <button 
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this Area Admin?')) {
                                try {
                                  const currentAdmins = JSON.parse(localStorage.getItem('app_area_admins') || '[]');
                                  const updatedAdmins = currentAdmins.filter((a: any) => a.id !== admin.id);
                                  localStorage.setItem('app_area_admins', JSON.stringify(updatedAdmins));
                                  setAreaAdmins(updatedAdmins);
                                } catch(e) { alert('Error deleting'); }
                              }
                            }}
                            className="text-red-600 hover:text-red-800 font-medium px-3 py-1 bg-red-50 rounded"
                          >
                            Delete
                          </button>`;
  
  // We'll replace the inner buttons entirely.
  const replacementButtons = newButton + `
                          <button 
                            onClick={() => setAaModal({ 
                              isOpen: true, 
                              id: admin.id, 
                              name: admin.name, 
                              email: admin.email, 
                              phone: admin.phone, 
                              password: admin.password || '', 
                              pincodes: (admin.pincodes || []).join(', '), 
                              canEditInventory: admin.permissions?.canEditInventory ?? true, 
                              canAlertTechs: admin.permissions?.canAlertTechs ?? true, 
                              canWA: admin.permissions?.canWA ?? true 
                            })}
                            className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1 bg-blue-50 rounded mr-2"
                          >
                            Edit
                          </button>
  ` + newDelete;
  
  return p1 + replacementButtons + p3;
});

// Add the panel rendering logic at the end of the return statement (before </main>)
const panelJSX = `
      {viewingAdminComplaints && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl h-full shadow-2xl flex flex-col animate-slide-in-right">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Area Complaints: {viewingAdminComplaints.name}</h3>
                <p className="text-sm text-slate-500">Pincodes: {viewingAdminComplaints.pincodes?.join(', ')}</p>
              </div>
              <button 
                onClick={() => setViewingAdminComplaints(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {(() => {
                const adminComplaints = complaints.filter(c => viewingAdminComplaints.pincodes?.includes(c.pincode));
                if (adminComplaints.length === 0) {
                  return <div className="text-center text-slate-500 mt-10">No complaints found for these pincodes.</div>;
                }
                return (
                  <div className="space-y-4">
                    {adminComplaints.map(c => (
                      <div key={c.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-bold text-slate-900">{c.ticketId}</span>
                            <span className="ml-2 text-sm text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</span>
                          </div>
                          <span className={\`px-2 py-1 rounded text-xs font-bold \${
                            c.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                            c.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }\`}>
                            {c.status}
                          </span>
                        </div>
                        <div className="text-sm text-slate-700 mb-2">
                          <span className="font-medium">{c.name}</span> • {c.phone}
                        </div>
                        <div className="text-sm text-slate-600 mb-2">{c.address}, {c.pincode}</div>
                        <div className="bg-slate-100 rounded p-2 text-sm text-slate-800 mb-2">
                          <span className="font-medium">{c.deviceType}</span>: {c.issue}
                        </div>
                        <div className="text-sm">
                          <span className="text-slate-500">Assigned Tech: </span>
                          <span className="font-medium text-slate-900">{c.assignedTechnicianName || 'Unassigned'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
`;

if (!code.includes("Area Complaints: {viewingAdminComplaints.name}")) {
  code = code.replace(
    "{aaModal.isOpen && (",
    panelJSX + "\n      {aaModal.isOpen && ("
  );
}

fs.writeFileSync('src/components/Admin.tsx', code);
