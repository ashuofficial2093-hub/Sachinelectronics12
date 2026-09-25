const fs = require('fs');
let content = fs.readFileSync('src/components/TechnicianDashboard.tsx', 'utf8');

const target = `                      )}
                    </div>

                    {complaint?.status === 'COMPLETED' && complaint?.resolutionDetails && (`;

const replacement = `                      )}
                    </div>
                    
                    {complaint?.technicianRemark && (
                      <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                        <p className="text-xs text-yellow-800 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" /> Technician Remark
                        </p>
                        <p className="text-sm text-yellow-900">{complaint.technicianRemark}</p>
                      </div>
                    )}

                    {complaint?.status === 'COMPLETED' && complaint?.resolutionDetails && (`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/TechnicianDashboard.tsx', content);
