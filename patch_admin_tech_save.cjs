const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

// Patch 1: handleSaveNewTech
const oldHandleSaveNewTech = `  const handleSaveNewTech = (e: React.FormEvent) => {
    e.preventDefault();
    const existing = JSON.parse(localStorage.getItem('app_area_techs') || '[]');
    const newEntry = {
      id: 'local_' + Date.now(),
      name: newTech.name,
      mobile: newTech.mobile,
      phone: newTech.mobile, // for compatibility
      pincodes: [newTech.pincode],
      skills: newTech.skills.split(',').map(s => s.trim()),
      isActive: newTech.isActive,
      role: 'technician',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('app_area_techs', JSON.stringify([...existing, newEntry]));
    setNewTechModalOpen(false);
    setNewTech({ name: '', mobile: '', pincode: '', skills: '', isActive: true });
    // Trigger re-render to fetch local techs
    fetchTechnicians(); 
  };`;

const newHandleSaveNewTech = `  const handleSaveNewTech = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = {
      id: 'tech_' + Date.now().toString(),
      name: newTech.name,
      mobile: newTech.mobile,
      phone: newTech.mobile,
      pincode: newTech.pincode || '208001',
      pincodes: [newTech.pincode],
      specialization: newTech.skills || 'Electricals',
      skills: newTech.skills.split(',').map(s => s.trim()),
      status: 'Approved',
      isActive: newTech.isActive,
      role: 'technician',
      createdAt: new Date().toISOString()
    };

    setTechnicians((prevTechs) => {
      const existing = JSON.parse(localStorage.getItem('app_area_techs') || '[]');
      const updatedLocal = [newEntry, ...existing];
      localStorage.setItem('app_area_techs', JSON.stringify(updatedLocal));
      return [newEntry, ...prevTechs];
    });

    setNewTechModalOpen(false);
    setNewTech({ name: '', mobile: '', pincode: '', skills: '', isActive: true });
  };`;

if(code.includes('const handleSaveNewTech = (e: React.FormEvent) => {')) {
  // Try to replace the exact old content
  if(code.includes('localStorage.setItem(\'app_area_techs\', JSON.stringify([...existing, newEntry]));')) {
    let before = code.substring(0, code.indexOf('const handleSaveNewTech'));
    let after = code.substring(code.indexOf('};', code.indexOf('fetchTechnicians();')) + 2);
    code = before + newHandleSaveNewTech + after;
  }
}

// Patch 2: The Approve action logic
const oldApprove = `      if (action === 'Approved') {
        // Also add to app_area_techs for the new assign modal
        const areaTechsRaw = localStorage.getItem('app_area_techs');
        const areaTechs = areaTechsRaw ? JSON.parse(areaTechsRaw) : [];
        
        // Find the application object to get its details (city -> pincode, skills -> skills)
        const appObj = technicianApplications.find(a => a.id === appId);
        
        const newAreaTech = {
          id: 'local_tech_' + Date.now(),
          name: name,
          mobile: phone,
          phone: phone,
          pincodes: appObj ? [appObj.city] : [],
          skills: appObj && appObj.skills ? appObj.skills : [],
          isActive: true,
          role: 'technician',
          createdAt: new Date().toISOString()
        };
        
        areaTechs.push(newAreaTech);
        localStorage.setItem('app_area_techs', JSON.stringify(areaTechs));
        
        // Also update standard technicians if needed
        const techs = secureStorage.getItem('technicians');
        const parsedTechs = Array.isArray(techs) ? techs : [];
        parsedTechs.push({
          id: newAreaTech.id,
          name: name,
          phone: phone,
          password: 'pass' + Math.floor(1000 + Math.random() * 9000),
          isActive: true
        });
        secureStorage.setItem('technicians', parsedTechs);
        fetchTechnicians(); // Refresh state
      }`;

const newApprove = `      if (action === 'Approved') {
        const appObj = technicianApplications.find(a => a.id === appId);
        const newEntry = {
          id: 'tech_' + Date.now().toString(),
          name: name,
          mobile: phone,
          phone: phone,
          pinCode: appObj ? appObj.city : '208001',
          pincodes: appObj ? [appObj.city] : [],
          specialization: appObj && appObj.skills ? appObj.skills.join(', ') : 'Electricals',
          skills: appObj && appObj.skills ? appObj.skills : [],
          status: 'Approved',
          isActive: true,
          role: 'technician',
          createdAt: new Date().toISOString()
        };
        
        setTechnicians((prevTechs) => {
          const existing = JSON.parse(localStorage.getItem('app_area_techs') || '[]');
          const updatedLocal = [newEntry, ...existing];
          localStorage.setItem('app_area_techs', JSON.stringify(updatedLocal));
          return [newEntry, ...prevTechs];
        });
        
        // Keep secureStorage sync for legacy code
        const techs = secureStorage.getItem('technicians');
        const parsedTechs = Array.isArray(techs) ? techs : [];
        parsedTechs.push({ ...newEntry, password: 'pass' + Math.floor(1000 + Math.random() * 9000) });
        secureStorage.setItem('technicians', parsedTechs);
      }`;

if (code.includes('if (action === \'Approved\') {')) {
  let startIndex = code.indexOf('if (action === \'Approved\') {');
  // Need to find the end of this block which is roughly fetchTechnicians(); // Refresh state      }
  let endIndex = code.indexOf('fetchTechnicians(); // Refresh state');
  if (endIndex > -1) {
    endIndex = code.indexOf('}', endIndex) + 1;
    code = code.substring(0, startIndex) + newApprove + code.substring(endIndex);
  }
}

// Patch 3: In MasterComplaintsView Assign Tech Dropdown, we might need to handle the fact that technicians now has everything
// Well, it merges technicians with app_area_techs, which means duplicates might appear if we put it in both.
// Let's deduplicate in the render just to be safe.
// Wait, we don't have to if we aren't modifying MasterComplaintsView yet. Admin.tsx has its own modal for some things but MasterComplaintsView is what we patched.
// Actually, earlier we saw Admin.tsx has a select:
// [...technicians, ...(JSON.parse(localStorage.getItem('app_area_techs') || '[]'))].map(t => (
// Since technicians now HAS the new item, it'll show up. If we also concatenate app_area_techs, it'll be duplicated.
// Let's fix that.

code = code.replace(
  /\\[\.\.\.technicians, \.\.\.\(JSON\.parse\(localStorage\.getItem\('app_area_techs'\) \|\| '\[\]'\)\)\\]/g,
  `[...new Map([...technicians, ...(JSON.parse(localStorage.getItem('app_area_techs') || '[]'))].map(item => [item.id || item.phone, item])).values()]`
);

fs.writeFileSync('src/components/Admin.tsx', code);
console.log('Patched Admin.tsx Add & Approve tech logic');
