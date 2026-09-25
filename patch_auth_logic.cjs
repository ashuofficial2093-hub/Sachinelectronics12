const fs = require('fs');
let content = fs.readFileSync('src/components/Admin.tsx', 'utf8');

const target = `    if (email === 'super@app.com' && password === 'super123') {`;

const replacement = `    let customSuperPassword = 'super123';
    try {
      const snap = await get(ref(rtdb, 'superAdminConfig/password'));
      if (snap.exists()) {
        customSuperPassword = snap.val();
      }
    } catch(e) {}

    if (email === 'super@app.com' && password === customSuperPassword) {`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/Admin.tsx', content);
