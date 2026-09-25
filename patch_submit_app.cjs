const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

const oldSubmit = `    const { appId, action, reason, phone, name } = techAppModal;
    if (!appId || !action) return;

    try {
      let newStatus = action;
      
      if (action === 'Approved') {
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
        };`;

const newSubmit = `    const { appId, action, reason, phone, name, loginId, password, areaAdminId } = techAppModal;
    if (!appId || !action) return;

    if (action === 'Approved' && (!loginId || !password || !areaAdminId)) {
      alert("Please fill all required credential and area assignment fields.");
      return;
    }

    try {
      let newStatus = action;
      
      if (action === 'Approved') {
        const appObj = technicianApplications.find(a => a.id === appId);
        const newEntry = {
          id: 'tech_' + Date.now().toString(),
          name: name,
          mobile: phone,
          phone: phone,
          loginId: loginId,
          password: password,
          areaAdminId: areaAdminId,
          pinCode: appObj ? appObj.city : '208001',
          pincodes: appObj ? [appObj.city] : [],
          specialization: appObj && appObj.skills ? appObj.skills.join(', ') : 'Electricals',
          skills: appObj && appObj.skills ? appObj.skills : [],
          status: 'Approved',
          isActive: true,
          role: 'technician',
          createdAt: new Date().toISOString()
        };`;

// Patch the parsedTechs.push to include the new credentials instead of random ones
const oldSecurePush = `parsedTechs.push({ ...newEntry, password: 'pass' + Math.floor(1000 + Math.random() * 9000) });`;
const newSecurePush = `parsedTechs.push({ ...newEntry, password: password });`;

if (code.includes('const { appId, action, reason, phone, name } = techAppModal;')) {
  code = code.replace(oldSubmit, newSubmit);
  code = code.replace(oldSecurePush, newSecurePush);
  fs.writeFileSync('src/components/Admin.tsx', code);
  console.log('Patched submitApplicationStatus successfully');
} else {
  console.log('Could not find submit block');
}
