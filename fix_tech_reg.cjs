const fs = require('fs');
let code = fs.readFileSync('src/components/TechnicianRegistration.tsx', 'utf8');

code = code.replace(/\/\/ Save to localStorage under key 'pending_technicians'[\s\S]*?\} catch \(err\) \{[\s\S]*?console\.error\("Failed to save to localStorage", err\);\s*\}/m, "");

fs.writeFileSync('src/components/TechnicianRegistration.tsx', code);
