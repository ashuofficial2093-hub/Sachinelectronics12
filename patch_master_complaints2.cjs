const fs = require('fs');
let code = fs.readFileSync('src/components/admin/MasterComplaintsView.tsx', 'utf8');

code = code.replace(
  />Assign Tech<\/button>/,
  '>🚨 Alert Technician</button>'
);

fs.writeFileSync('src/components/admin/MasterComplaintsView.tsx', code);
console.log('Patched MasterComplaintsView.tsx');
