const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

const oldNav = `<button onClick={() => setActiveTab('technicianApplications')} className={\`whitespace-nowrap px-3 py-2 rounded-md text-sm font-medium \${activeTab === 'technicianApplications' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}\`}>👨‍🔧 Pending Techs</button>`;
const newNav = `<button onClick={() => setActiveTab('technicianApplications')} className={\`whitespace-nowrap px-3 py-2 rounded-md text-sm font-medium \${activeTab === 'technicianApplications' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}\`}>👨‍🔧 Pending Techs</button>
                    <button onClick={() => setActiveTab('manageTechnicians')} className={\`whitespace-nowrap px-3 py-2 rounded-md text-sm font-medium \${activeTab === 'manageTechnicians' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}\`}>👨‍🔧 Manage Technicians</button>`;

code = code.replace(oldNav, newNav);

const oldMobileNav = `<option value="technicianApplications">Pending Techs</option>`;
const newMobileNav = `<option value="technicianApplications">Pending Techs</option>
                  <option value="manageTechnicians">Manage Technicians</option>`;

if (code.includes(oldMobileNav)) {
  code = code.replace(oldMobileNav, newMobileNav);
}

fs.writeFileSync('src/components/Admin.tsx', code);
console.log('Patched nav');
