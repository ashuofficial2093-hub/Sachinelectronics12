const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf8');

if (!code.includes('areaAdminsCollection')) {
  code += `\nexport const areaAdminsCollection = collection(db, 'areaAdmins');`;
  code += `\nexport const loyaltyCollection = collection(db, 'loyalty');`;
  fs.writeFileSync('src/lib/firebase.ts', code);
}
