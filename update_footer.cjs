const fs = require('fs');
let code = fs.readFileSync('src/components/Footer.tsx', 'utf8');

code = code.replace(
  '<a href="#admin" className="text-slate-800 hover:text-slate-600 transition-colors">Admin Login</a>',
  '<a href="#super-admin" className="text-slate-800 hover:text-slate-600 transition-colors">Super Admin Login</a>\n            <a href="#area-admin" className="text-slate-800 hover:text-slate-600 transition-colors">Area Admin Login</a>'
);

fs.writeFileSync('src/components/Footer.tsx', code);
