const fs = require('fs');
let code = fs.readFileSync('src/components/AreaAdminDashboard.tsx', 'utf8');

code = code.replace(
  "const adminPincode = sessionData?.pincodes?.[0] || sessionData?.pincode || sessionData?.assignedPincodes?.[0] || '';",
  "const adminPincode = sessionData?.pincode || (sessionData?.pincodes ? sessionData.pincodes[0] : '') || '';"
);

fs.writeFileSync('src/components/AreaAdminDashboard.tsx', code);
