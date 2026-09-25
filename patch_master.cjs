const fs = require('fs');
let code = fs.readFileSync('src/components/admin/MasterComplaintsView.tsx', 'utf8');

// Remove the 'Alert Technician' button
code = code.replace(
  /<button onClick=\{\(\) => handleOpenAssignModal\?\.\(complaint\.id\)\} className="block w-full text-left px-3 py-1\.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors">🚨 Alert Technician<\/button>/g,
  ''
);

fs.writeFileSync('src/components/admin/MasterComplaintsView.tsx', code);
