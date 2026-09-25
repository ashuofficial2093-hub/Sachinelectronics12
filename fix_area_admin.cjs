const fs = require('fs');
let code = fs.readFileSync('src/components/AreaAdminDashboard.tsx', 'utf8');

const oldEffect = /const sessionData = safeJSONParse\(localStorage\.getItem\('area_admin_session'\), null\);[\s\S]*?const sorted = filteredComplaints\.sort/m;

const newEffect = `const sessionData = safeJSONParse(localStorage.getItem('area_admin_session'), null);
        const adminPincode = sessionData?.pincodes?.[0] || sessionData?.pincode || sessionData?.assignedPincodes?.[0] || '';
        
        const filteredComplaints = rtdbData.filter((complaint: any) => {
           return String(complaint.pincode || complaint.pinCode || '').trim() === String(adminPincode).trim();
        });
        
        const sorted = filteredComplaints.sort`;

code = code.replace(oldEffect, newEffect);
fs.writeFileSync('src/components/AreaAdminDashboard.tsx', code);
