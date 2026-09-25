const fs = require('fs');
let code = fs.readFileSync('src/components/TechnicianDashboard.tsx', 'utf8');

const regexTechLogin = /const activeTechs = safeJSONParse\(localStorage\.getItem\('app_active_technicians'\), JSON\.parse\('\[\]'\)\);\s*const foundTech = activeTechs\?\.find\(\(t: any\) => t\.phone === loginPhone && t\.password === loginPassword\);/m;
const replaceTechLogin = `
      let foundTech = null;
      try {
        const snapshot = await get(ref(rtdb, 'technicians'));
        if (snapshot.exists()) {
          const techs = Object.keys(snapshot.val()).map(k => snapshot.val()[k]);
          foundTech = techs.find((t: any) => t.phone === loginPhone && t.password === loginPassword);
        }
      } catch (err) {}
`;
code = code.replace(regexTechLogin, replaceTechLogin);

const regexFetch1 = /const localComplaints = safeJSONParse\(localStorage\.getItem\('app_complaints'\), \[\]\);\s*const myComplaints = localComplaints\?\.filter\(\(c: any\) => c\.assignedTechnicianId === tech\.id\);\s*if \(myComplaints\?\.length\) setComplaints\(myComplaints\);/m;
const replaceFetch1 = `// Fetch from RTDB onValue is already happening below`;
code = code.replace(regexFetch1, replaceFetch1);

const regexFetch2 = /const localComplaints = safeJSONParse\(localStorage\.getItem\('app_complaints'\), JSON\.parse\('\[\]'\)\);\s*const myComplaints = localComplaints\?\.filter\(\(c: any\) => c\.assignedTechnicianId === tech\.id\);\s*if \(myComplaints\?\.length\) setComplaints\(myComplaints\);/m;
const replaceFetch2 = `// RTDB sync is primary`;
code = code.replace(regexFetch2, replaceFetch2);

fs.writeFileSync('src/components/TechnicianDashboard.tsx', code);
