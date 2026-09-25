const fs = require('fs');
console.log(fs.readFileSync('src/components/Admin.tsx', 'utf8').includes('window.addEventListener(\'technician_submitted\''));
