const fs = require('fs');
let code = fs.readFileSync('src/components/AreaAdminDashboard.tsx', 'utf8');

const oldEffect = /const sessionData = safeJSONParse\(localStorage\.getItem\('area_admin_session'\), null\);[\s\S]*?const sorted = filteredComplaints\.sort/m;

const newEffect = `const sessionData = safeJSONParse(localStorage.getItem('area_admin_session'), null);
        const currentAdminPincodes = sessionData?.pincodes || sessionData?.assignedPincodes || [sessionData?.pincode] || [];
        
        let adminPincodesArray = [];
        if (Array.isArray(currentAdminPincodes)) {
          adminPincodesArray = currentAdminPincodes.map(p => String(p).trim());
        } else {
          adminPincodesArray = String(currentAdminPincodes || '').split(',').map(p => p.trim());
        }
        
        const filteredComplaints = rtdbData.filter((complaint: any) => {
           const compPin = String(complaint.pincode || complaint.pinCode || '').trim();
           return adminPincodesArray.some(adminPin => adminPin === compPin);
        });
        
        const sorted = filteredComplaints.sort`;

code = code.replace(oldEffect, newEffect);
fs.writeFileSync('src/components/AreaAdminDashboard.tsx', code);
