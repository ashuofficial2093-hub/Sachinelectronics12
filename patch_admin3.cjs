const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

const tabContent = `
        ) : activeTab === 'technicianApplications' ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" /> Pending Technician Applications
              </h2>
            </div>
            <div className="p-6">
              {technicianApplications.length === 0 ? (
                <div className="text-center text-slate-500 py-12">No pending applications found.</div>
              ) : (
                <div className="space-y-6">
                  {technicianApplications.map(app => (
                    <div key={app.id} className="border border-slate-200 rounded-xl p-6 bg-slate-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 mb-2">{app.fullName}</h3>
                          <div className="space-y-2 text-sm text-slate-600">
                            <p><span className="font-medium text-slate-800">Status:</span> 
                                <span className={\`ml-2 px-2 py-0.5 rounded-full text-xs font-bold uppercase \${app.status === 'Approved' ? 'bg-green-100 text-green-700' : app.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}\`}>
                                    {app.status}
                                </span>
                            </p>
                            <p><span className="font-medium text-slate-800">Mobile:</span> {app.mobile}</p>
                            <p><span className="font-medium text-slate-800">WhatsApp:</span> {app.whatsapp}</p>
                            <p><span className="font-medium text-slate-800">City:</span> {app.city}</p>
                            <p><span className="font-medium text-slate-800">Experience:</span> {app.experience} Years</p>
                            <p><span className="font-medium text-slate-800">Skills:</span> {app.skills?.join(', ')}</p>
                            <p><span className="font-medium text-slate-800">Applied On:</span> {new Date(app.createdAt).toLocaleString()}</p>
                          </div>
                          
                          <div className="mt-6 flex gap-3">
                             <button onClick={() => updateApplicationStatus(app.id, 'Approved')} className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold text-sm hover:bg-green-700 transition-colors">Approve</button>
                             <button onClick={() => updateApplicationStatus(app.id, 'Hold')} className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-semibold text-sm hover:bg-yellow-600 transition-colors">Hold</button>
                             <button onClick={() => updateApplicationStatus(app.id, 'Rejected')} className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold text-sm hover:bg-red-700 transition-colors">Reject</button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                           {app.documents?.photo && (
                             <div>
                               <p className="text-xs font-bold text-slate-500 mb-1">Live Photo</p>
                               <img src={app.documents.photo} alt="Selfie" className="w-full h-32 object-cover rounded-lg border border-slate-300" />
                             </div>
                           )}
                           {app.documents?.aadhaar && (
                             <div>
                               <p className="text-xs font-bold text-slate-500 mb-1">Aadhaar</p>
                               <img src={app.documents.aadhaar} alt="Aadhaar" className="w-full h-32 object-cover rounded-lg border border-slate-300" />
                             </div>
                           )}
                           {app.documents?.pan && (
                             <div>
                               <p className="text-xs font-bold text-slate-500 mb-1">PAN Card</p>
                               <img src={app.documents.pan} alt="PAN" className="w-full h-32 object-cover rounded-lg border border-slate-300" />
                             </div>
                           )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
`;

code = code.replace(
  /\) : activeTab === 'promotions' \? \(/,
  tabContent + "$&"
);

// add updateApplicationStatus function
const updateStatusFn = `
  const updateApplicationStatus = async (id: string, status: 'Approved' | 'Rejected' | 'Hold') => {
    if(window.confirm(\`Are you sure you want to mark this as \${status}?\`)) {
       try {
         const docRef = doc(db, 'technicianApplications', id);
         await updateDoc(docRef, { status });
         setTechnicianApplications(prev => prev.map(app => app.id === id ? { ...app, status } : app));
       } catch (err) {
         console.error(err);
         alert("Failed to update status");
       }
    }
  };
`;

if(!code.includes('const updateApplicationStatus =')) {
  code = code.replace(
    /const handleAddTechnician = async \(e: React.FormEvent\) => \{/,
    updateStatusFn + "\n  $&"
  );
}

fs.writeFileSync('src/components/Admin.tsx', code);
