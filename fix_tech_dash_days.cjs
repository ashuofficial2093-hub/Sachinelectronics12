const fs = require('fs');
let code = fs.readFileSync('src/components/TechnicianDashboard.tsx', 'utf8');

const regex = /const days = Array\.from\(\{ length: daysInMonth \}, \(_, i\) => \(\{\s*date: i \+ 1,\s*status: 'pending' as const\s*\}\)\);/m;
const replace = `const days = Array.from({ length: daysInMonth }, (_, i) => new Date(today.getFullYear(), today.getMonth(), i + 1));`;

code = code.replace(regex, replace);

fs.writeFileSync('src/components/TechnicianDashboard.tsx', code);
