const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

code = code.replace(
  /<label className="block text-sm font-medium text-slate-700 mb-1">Email<\/label>/g,
  '<label className="block text-sm font-medium text-slate-700 mb-1">Login ID (Email)</label>'
);

fs.writeFileSync('src/components/Admin.tsx', code);
console.log('Patched Area Admin Login UI');
