const fs = require('fs');
let code = fs.readFileSync('src/components/Features.tsx', 'utf8');
code = code.replace(/rtrtdb/g, 'rtdb');
fs.writeFileSync('src/components/Features.tsx', code);
