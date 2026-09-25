const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

const oldNewTech = /const \[newTech, setNewTech\] = useState\(\{ name: '', mobile: '', pincode: '', skills: '', loginId: '', password: '', areaAdminId: '', isActive: true \}\);/;
const newNewTech = `const [newTech, setNewTech] = useState({ name: '', mobile: '', pincode: '', skills: '', loginId: '', password: '', areaAdminId: '', isActive: true, baseSalary: 15000 });`;
code = code.replace(oldNewTech, newNewTech);

const oldHandleEditTech = /setNewTech\(\{\n\s+name: tech\.name,\n\s+mobile: tech\.mobile \|\| tech\.phone \|\| '',\n\s+pincode: tech\.pinCode \|\| tech\.pincodes\?\.\[0\] \|\| '',\n\s+skills: tech\.specialization \|\| tech\.skills\?\.join\(', '\) \|\| '',\n\s+loginId: tech\.loginId \|\| '',\n\s+password: tech\.password \|\| '',\n\s+areaAdminId: tech\.areaAdminId \|\| '',\n\s+isActive: tech\.isActive !== false\n\s+\}\);/m;

const newHandleEditTech = `setNewTech({
      name: tech.name,
      mobile: tech.mobile || tech.phone || '',
      pincode: tech.pinCode || tech.pincodes?.[0] || '',
      skills: tech.specialization || tech.skills?.join(', ') || '',
      loginId: tech.loginId || '',
      password: tech.password || '',
      areaAdminId: tech.areaAdminId || '',
      isActive: tech.isActive !== false,
      baseSalary: tech.baseSalary || 15000
    });`;
code = code.replace(oldHandleEditTech, newHandleEditTech);

const oldSaveTech = /isActive: newTech\.isActive,\n\s+role: 'technician',\n\s+createdAt: new Date\(\)\.toISOString\(\)\n\s+\};/m;
const newSaveTech = `isActive: newTech.isActive,
      baseSalary: newTech.baseSalary,
      role: 'technician',
      createdAt: new Date().toISOString()
    };`;
code = code.replace(oldSaveTech, newSaveTech);

// Reset modal state after save
const oldReset = /setNewTech\(\{ name: '', mobile: '', pincode: '', skills: '', loginId: '', password: '', areaAdminId: '', isActive: true \}\);/g;
const newReset = `setNewTech({ name: '', mobile: '', pincode: '', skills: '', loginId: '', password: '', areaAdminId: '', isActive: true, baseSalary: 15000 });`;
code = code.replace(oldReset, newReset);

// Add form field for base salary
const formField = `
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">💰 Base Monthly Salary (₹)</label>
                  <input required type="number" value={newTech.baseSalary} onChange={e => setNewTech({...newTech, baseSalary: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-0 focus:border-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all bg-white" placeholder="e.g. 15000" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 p-4 rounded-xl border border-blue-100">`;

code = code.replace(/<div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 p-4 rounded-xl border border-blue-100">/, formField);

// Modify Active Technicians View to show salary info
// "Pincode: ..." is a good anchor
const salaryInfo = `<p className="text-sm font-medium mt-1"><span className="text-slate-500">Base Salary:</span> <span className="text-green-700 font-bold">₹{tech.baseSalary || 15000}</span></p>`;
code = code.replace(/<p className="text-sm text-slate-600 mt-0\.5"><span className="font-semibold">Pincode:<\/span> \{tech\.pinCode \|\| tech\.pincodes\?\.\[0\] \|\| 'N\/A'\}<\/p>/, `<p className="text-sm text-slate-600 mt-0.5"><span className="font-semibold">Pincode:</span> {tech.pinCode || tech.pincodes?.[0] || 'N/A'}</p>\n                            ${salaryInfo}`);


fs.writeFileSync('src/components/Admin.tsx', code);
