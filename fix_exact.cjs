const fs = require('fs');
let code = fs.readFileSync('src/components/AreaAdminDashboard.tsx', 'utf8');

const oldEffect = /let adminPincodesArray = \[\];[\s\S]*?const sorted = filteredComplaints\.sort/m;

const newEffect = `const adminPincodesArray = String(currentAdminPincodes || '')
          .split(',')
          .map(p => p.trim());
        
        const filteredComplaints = rtdbData.filter((complaint: any) => {
           const compPin = String(complaint.pincode || complaint.pinCode || '').trim();
           return adminPincodesArray.some(adminPin => adminPin === compPin);
        });
        
        const sorted = filteredComplaints.sort`;

code = code.replace(oldEffect, newEffect);
fs.writeFileSync('src/components/AreaAdminDashboard.tsx', code);
