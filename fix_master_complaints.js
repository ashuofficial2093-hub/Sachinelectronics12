const fs = require('fs');
let code = fs.readFileSync('src/components/admin/MasterComplaintsView.tsx', 'utf8');

if (!code.includes('handleAssignTechnician?:')) {
  code = code.replace(/handleOpenAssignModal\?: \(id: string\) => void;/, 'handleOpenAssignModal?: (id: string) => void;\n  handleAssignTechnician?: (complaintId: string, techId: string) => void;');
}

const targetHtml = `{complaint.assignedTechnicianId ? (
                        <div className="text-sm font-medium text-slate-900 flex items-center gap-1">
                          <User className="w-3 h-3"/> 
                          {technicians?.find(t => t.id === complaint.assignedTechnicianId)?.name || 'Assigned Tech'}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 italic">Unassigned</span>
                      )}`;

const replaceHtml = `{complaint.status === 'COMPLETED' ? (
                        <div className="text-sm font-medium text-slate-900 flex items-center gap-1">
                          <User className="w-3 h-3"/> 
                          {technicians?.find(t => t.id === complaint.assignedTechnicianId)?.name || 'Assigned Tech'}
                        </div>
                      ) : (
                        <select
                          value={complaint.assignedTechnicianId || ''}
                          onChange={(e) => {
                            if (handleAssignTechnician && e.target.value) {
                              handleAssignTechnician(complaint.id, e.target.value);
                            }
                          }}
                          className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded text-slate-700 bg-slate-50 focus:border-blue-500 outline-none"
                        >
                          <option value="">Unassigned</option>
                          {technicians?.map(t => (
                            <option key={t.id} value={t.id}>{t.name} {t.phone ? '(' + t.phone + ')' : ''}</option>
                          ))}
                        </select>
                      )}`;

code = code.replace(targetHtml, replaceHtml);
// also handleAssignTechnician is missing from destructured props
code = code.replace(/handleAssignAreaAdmin/, 'handleAssignAreaAdmin, handleAssignTechnician');

fs.writeFileSync('src/components/admin/MasterComplaintsView.tsx', code);
