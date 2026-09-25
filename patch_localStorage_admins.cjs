const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

// 1. Replace fetchAreaAdmins
const oldFetchAreaAdmins = `  const fetchAreaAdmins = async () => {
    try {
      const snapshot = await getDocs(areaAdminsCollection);
      setAreaAdmins(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e) { console.error(e); }
  };`;

const newFetchAreaAdmins = `  const fetchAreaAdmins = async () => {
    try {
      const localAdmins = localStorage.getItem('app_area_admins');
      if (localAdmins) {
        setAreaAdmins(JSON.parse(localAdmins));
      } else {
        const mockAdmin = {
          id: 'mock-1',
          name: 'Kanpur Admin',
          phone: '9876543210',
          email: 'kanpur@app.com',
          pincodes: ['208001', '209202'],
          permissions: { canEditInventory: true, canAlertTechs: true, canWA: true },
          isActive: true
        };
        localStorage.setItem('app_area_admins', JSON.stringify([mockAdmin]));
        setAreaAdmins([mockAdmin]);
      }
    } catch (e) { console.error(e); }
  };`;

code = code.replace(oldFetchAreaAdmins, newFetchAreaAdmins);

// 2. Replace handleSaveAreaAdmin
const oldHandleSaveAreaAdminRegex = /const handleSaveAreaAdmin = async \(e: React\.FormEvent\) => \{[\s\S]*?setAaModal\(\{ isOpen: false[^}]*\}\);\n    \} catch \(e\) \{\n      alert\("Error saving area admin"\);\n    \}\n  \};/;

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
    } catch (e) {
      alert("Error saving area admin");
    }
  };`;

code = code.replace(oldHandleSaveAreaAdminRegex, newHandleSaveAreaAdmin);

fs.writeFileSync('src/components/Admin.tsx', code);
