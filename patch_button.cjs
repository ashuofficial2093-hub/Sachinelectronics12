const fs = require('fs');
let content = fs.readFileSync('src/components/TechnicianDashboard.tsx', 'utf8');

const target = `                  {complaint?.status !== 'COMPLETED' && (
                    <div className="p-4 border-t border-slate-100 bg-slate-50">
                      <button 
                        onClick={() => {
                          if (complaint.id) {
                            setResolvingComplaintId(complaint.id);
                            setResolutionModalOpen(true);
                          }
                        }}
                        className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-2.5 px-4 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                      >
                        <Check className="w-5 h-5" /> Mark as Completed
                      </button>
                    </div>
                  )}`;

const replacement = `                  {complaint?.status !== 'COMPLETED' && (
                    <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
                      <button 
                        onClick={() => {
                          if (complaint.id) {
                            setResolvingComplaintId(complaint.id);
                            setResolutionModalOpen(true);
                          }
                        }}
                        className="flex-1 flex justify-center items-center gap-2 bg-blue-600 text-white py-2.5 px-4 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                      >
                        <Check className="w-5 h-5" /> Mark as Completed
                      </button>
                      
                      <button 
                        onClick={() => {
                          if (complaint.id) {
                            setRemarkingComplaintId(complaint.id);
                            setTechnicianRemark(complaint.technicianRemark || '');
                            setRemarkStatus(complaint.status !== 'COMPLETED' ? complaint.status : 'Pending - Part Required');
                            setRemarkModalOpen(true);
                          }
                        }}
                        className="flex-1 flex justify-center items-center gap-2 bg-yellow-500 text-white py-2.5 px-4 rounded-lg font-bold hover:bg-yellow-600 transition-colors text-sm"
                      >
                        <MessageCircle className="w-4 h-4" /> Report Issue / Remark
                      </button>
                    </div>
                  )}`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/TechnicianDashboard.tsx', content);
