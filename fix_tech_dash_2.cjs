const fs = require('fs');
let code = fs.readFileSync('src/components/TechnicianDashboard.tsx', 'utf8');

const regex1 = /const activeTechs = safeJSONParse\(localStorage\.getItem\('app_active_technicians'\), JSON\.parse\('\[\]'\)\);\s*const foundTech = activeTechs\?\.find\(\(t: any\) => t\.phone === loginPhone && t\.password === loginPassword\);/m;
const replace1 = `
      let foundTech = null;
      try {
        const snapshot = await get(ref(rtdb, 'technicians'));
        if (snapshot.exists()) {
          const techs = Object.keys(snapshot.val()).map(k => snapshot.val()[k]);
          foundTech = techs.find((t: any) => t.phone === loginPhone && t.password === loginPassword);
        }
      } catch (err) {}
`;
if (code.match(regex1)) {
  code = code.replace(regex1, replace1);
} else {
  // alternative regex if formatting is different
  const altRegex = /const activeTechs = safeJSONParse\(localStorage\.getItem\('app_active_technicians'\), JSON\.parse\('\[\]'\)\);[\s\S]*?const foundTech = activeTechs\?\.find\(\(t: any\) => t\.phone === loginPhone && t\.password === loginPassword\);/m;
  code = code.replace(altRegex, replace1);
}

code = code.replace(/const localComplaints = safeJSONParse\(localStorage\.getItem\('app_complaints'\), \[\]\);\s*const myComplaints = localComplaints\?\.filter\(\(c: any\) => c\.assignedTechnicianId === tech\.id\);\s*if \(myComplaints\?\.length\) setComplaints\(myComplaints\);/m, "");
code = code.replace(/const localComplaints = safeJSONParse\(localStorage\.getItem\('app_complaints'\), JSON\.parse\('\[\]'\)\);\s*const myComplaints = localComplaints\?\.filter\(\(c: any\) => c\.assignedTechnicianId === tech\.id\);\s*if \(myComplaints\?\.length\) setComplaints\(myComplaints\);/m, "");

fs.writeFileSync('src/components/TechnicianDashboard.tsx', code);
