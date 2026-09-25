const fs = require('fs');
let types = fs.readFileSync('src/types.ts', 'utf8');

types = types.replace(
  /aadhaar\?: string;/,
  'aadhaarFront?: string;\n    aadhaarBack?: string;'
);

fs.writeFileSync('src/types.ts', types);
