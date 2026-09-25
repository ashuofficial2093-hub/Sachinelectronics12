const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// Update desktop links
code = code.replace(
  '<a href="#admin" className="hover:text-blue-600 transition-colors">Admin</a>',
  '<a href="#super-admin" className="hover:text-blue-600 transition-colors">Super Admin Login</a><a href="#area-admin" className="hover:text-blue-600 transition-colors">Area Admin Login</a>'
);

// Update mobile links
code = code.replace(
  '<a href="#admin" onClick={() => setIsMenuOpen(false)} className="hover:text-blue-600 transition-colors">Admin Login</a>',
  '<a href="#super-admin" onClick={() => setIsMenuOpen(false)} className="hover:text-blue-600 transition-colors">Super Admin Login</a><a href="#area-admin" onClick={() => setIsMenuOpen(false)} className="hover:text-blue-600 transition-colors">Area Admin Login</a>'
);

fs.writeFileSync('src/components/Navbar.tsx', code);
