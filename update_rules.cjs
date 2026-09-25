const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf8');

if (!code.includes('areaAdmins')) {
  code = code.replace('  }\n}', `    match /areaAdmins/{document=**} {\n      allow read, write: if true;\n    }\n    match /loyalty/{document=**} {\n      allow read, write: if true;\n    }\n  }\n}`);
  fs.writeFileSync('firestore.rules', code);
}
