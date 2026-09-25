const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

code = code.replace(
  `                              onClick={() => {
                                if(confirm('Are you sure you want to delete this technician?')) {
                                  const existing = safeJSONParse(localStorage.getItem('app_active_technicians'), JSON.parse('[]'));
                                  const updated = existing?.filter(t => t.id !== tech?.id && t.phone !== tech?.phone);
                                  localStorage.setItem('app_active_technicians', JSON.stringify(updated));
                                  setTechnicians(prev => prev?.filter(t => t.id !== tech?.id && t.phone !== tech?.phone));
                                }
                              }}`,
  `                              onClick={() => {
                                if(confirm('Are you sure you want to delete this technician? This action cannot be undone.')) {
                                  const existing = safeJSONParse(localStorage.getItem('app_active_technicians'), JSON.parse('[]'));
                                  const updated = existing?.filter((t: any) => t.id !== tech?.id && t.phone !== tech?.phone);
                                  localStorage.setItem('app_active_technicians', JSON.stringify(updated));
                                  setTechnicians(prev => prev?.filter((t: any) => t.id !== tech?.id && t.phone !== tech?.phone));
                                  if (tech?.id) {
                                    remove(ref(rtdb, 'technicians/' + tech.id)).then(() => alert('Deleted successfully')).catch((e) => console.warn(e));
                                  } else {
                                    alert('Deleted successfully');
                                  }
                                }
                              }}`
);

fs.writeFileSync('src/components/Admin.tsx', code);
