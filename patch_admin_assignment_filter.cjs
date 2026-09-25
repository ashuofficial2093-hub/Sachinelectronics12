const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

const regexOldDropdown = /\{\[\.\.\.new Map\(\[\.\.\.technicians, \.\.\.\(JSON\.parse\(localStorage\.getItem\('app_area_techs'\) \|\| '\[\]'\)\)\]\.map\(item => \[item\.id \|\| item\.phone, item\]\)\)\.values\(\)\]\.map\(t => \(/;

const newDropdown = `{(() => {
                    const complaint = complaints.find(c => c.id === assigningComplaintId);
                    const cPin = complaint?.pincode;
                    const cAdmin = areaAdmins.find(a => a.pincodes && a.pincodes.includes(cPin));
                    const allTechs = [...new Map([...technicians, ...(JSON.parse(localStorage.getItem('app_area_techs') || '[]'))].map(item => [item.id || item.phone, item])).values()];
                    const filteredTechs = allTechs.filter(t => {
                      if (!cPin) return true;
                      const matchesAreaAdmin = cAdmin && t.areaAdminId === cAdmin.id;
                      const matchesPin = t.pincodes && t.pincodes.includes(cPin);
                      const matchesTechPin = t.pinCode === cPin;
                      return matchesAreaAdmin || matchesPin || matchesTechPin;
                    });
                    return filteredTechs;
                  })().map(t => (`;

if (regexOldDropdown.test(code)) {
  code = code.replace(regexOldDropdown, newDropdown);
  fs.writeFileSync('src/components/Admin.tsx', code);
  console.log('Patched assignment dropdown filter');
} else {
  console.log('Could not find assignment dropdown');
}
