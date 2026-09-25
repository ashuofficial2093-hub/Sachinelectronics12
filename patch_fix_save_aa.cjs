const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

// We can just use string replacement if we extract the whole function
const oldHandleSaveAreaAdminMatch = code.match(/const handleSaveAreaAdmin = async \(e: React\.FormEvent\) => \{[\s\S]*?alert\("Error saving Area Admin"\);\n    \}\n  \};/);

if (oldHandleSaveAreaAdminMatch) {
  const newHandleSaveAreaAdmin = `const handleSaveAreaAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const pins = aaModal.pincodes.split(',').map(s => s.trim()).filter(s => s);
      const data = {
        name: aaModal.name,
        email: aaModal.email,
        phone: aaModal.phone,
        password: aaModal.password,
        pincodes: pins,
        permissions: {
          canEditInventory: aaModal.canEditInventory,
          canAlertTechs: aaModal.canAlertTechs,
          canWA: aaModal.canWA
        },
        isActive: true
      };

      const currentAdmins = JSON.parse(localStorage.getItem('app_area_admins') || '[]');
      
      if (aaModal.id) {
        const index = currentAdmins.findIndex((a: any) => a.id === aaModal.id);
        if (index > -1) {
          currentAdmins[index] = { ...currentAdmins[index], ...data };
        }
      } else {
        const newAdmin = { ...data, id: Date.now().toString() };
        currentAdmins.push(newAdmin);
      }
      
      localStorage.setItem('app_area_admins', JSON.stringify(currentAdmins));
      setAreaAdmins(currentAdmins);
      
      setAaModal({ isOpen: false, id: '', name: '', email: '', phone: '', password: '', pincodes: '', canEditInventory: true, canAlertTechs: true, canWA: true });
      setToastMessage("Area Admin Saved Successfully");
      setTimeout(() => setToastMessage(''), 3000);
    } catch (e) {
      console.error(e);
      alert("Error saving Area Admin");
    }
  };`;
  code = code.replace(oldHandleSaveAreaAdminMatch[0], newHandleSaveAreaAdmin);
  console.log("Replaced handleSaveAreaAdmin");
} else {
  console.log("Could not match handleSaveAreaAdmin");
}

const oldHandleToggleAreaAdminStatusMatch = code.match(/const handleToggleAreaAdminStatus = async \(id: string, currentStatus: boolean\) => \{[\s\S]*?\} catch \(e\) \{ console\.error\(e\); \}\n  \};/);
if (oldHandleToggleAreaAdminStatusMatch) {
  const newHandleToggleAreaAdminStatus = `const handleToggleAreaAdminStatus = async (id: string, currentStatus: boolean) => {
    try {
      const currentAdmins = JSON.parse(localStorage.getItem('app_area_admins') || '[]');
      const index = currentAdmins.findIndex((a: any) => a.id === id);
      if (index > -1) {
        currentAdmins[index].isActive = !currentStatus;
        localStorage.setItem('app_area_admins', JSON.stringify(currentAdmins));
        setAreaAdmins(currentAdmins);
      }
    } catch (e) { console.error(e); }
  };`;
  code = code.replace(oldHandleToggleAreaAdminStatusMatch[0], newHandleToggleAreaAdminStatus);
  console.log("Replaced handleToggleAreaAdminStatus");
}

fs.writeFileSync('src/components/Admin.tsx', code);
