const fs = require('fs');
let code = fs.readFileSync('src/components/Hero.tsx', 'utf8');
code = code.replace(/href="#repair-form"/, 'href="#complaint"');
fs.writeFileSync('src/components/Hero.tsx', code);
