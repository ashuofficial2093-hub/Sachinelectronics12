const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

// Fix tech login
code = code.replace(/\/\/ Login handled via technicians list\s*if \(\!snap\.empty\) \{/m, `const foundTech = technicians.find(t => t.email === email || t.loginId === email || t.phone === email);
      if (foundTech) {
        const snap = { empty: false, docs: [{ data: () => foundTech }] };
        if (!snap.empty) {`);
        
// Fix view history
code = code.replace(/const history = snapshot\.docs\?\.map\(doc => \(\{ id: doc\.id, \.\.\.doc\.data\(\) \}\)\) as Complaint\[\];/m, `const history = myComplaints;`);

fs.writeFileSync('src/components/Admin.tsx', code);
