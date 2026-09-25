const fs = require('fs');
let code = fs.readFileSync('src/components/ComplaintForm.tsx', 'utf8');

// Replace localStorage get pricing with RTDB fetch
code = code.replace(/const localPricing = localStorage\.getItem\('app_pricing_settings'\);\s*if \(localPricing\) setPricing\(JSON\.parse\(localPricing\)\);\s*/g, '');
code = code.replace(/localStorage\.setItem\('app_pricing_settings', JSON\.stringify\(newSettings\)\);\s*/g, '');

const regexAdmins1 = /try \{\s*const localAdmins = safeJSONParse\(localStorage\.getItem\('app_area_admins'\), \[\]\);\s*const localMatch = localAdmins\.find\(\(a: any\) => a\.pincodes && a\.pincodes\.includes\(finalPincode\) && a\.isActive\);\s*if \(localMatch\) assignedAreaAdminId = localMatch\.id;\s*\} catch \(err\) \{\}/;
const replaceAdmins1 = `try {
        const snapshot = await get(ref(rtdb, 'areaAdmins'));
        if (snapshot.exists()) {
          const admins = Object.keys(snapshot.val()).map(k => snapshot.val()[k]);
          const localMatch = admins.find((a: any) => a.pincodes && a.pincodes.includes(finalPincode) && a.isActive);
          if (localMatch) assignedAreaAdminId = localMatch.id;
        }
      } catch (err) {}`;
code = code.replace(regexAdmins1, replaceAdmins1);

const regexAdmins2 = /try \{\s*const localAdmins = safeJSONParse\(localStorage\.getItem\('app_area_admins'\), \[\]\);\s*const matchingAdmin = localAdmins\.find\(\(a: any\) => a\.pincodes && a\.pincodes\.includes\(finalPincode\) && a\.isActive\);\s*if \(matchingAdmin && matchingAdmin\.phone\) \{\s*adminPhone = matchingAdmin\.phone\.replace\(\/\[\^0-9\]\/g, ''\);\s*if \(adminPhone\.length === 10\) adminPhone = "91" \+ adminPhone;\s*\}\s*\} catch\(e\) \{\}/;
const replaceAdmins2 = `try {
        const snapshot = await get(ref(rtdb, 'areaAdmins'));
        if (snapshot.exists()) {
          const admins = Object.keys(snapshot.val()).map(k => snapshot.val()[k]);
          const matchingAdmin = admins.find((a: any) => a.pincodes && a.pincodes.includes(finalPincode) && a.isActive);
          if (matchingAdmin && matchingAdmin.phone) {
            adminPhone = matchingAdmin.phone.replace(/[^0-9]/g, '');
            if (adminPhone.length === 10) adminPhone = "91" + adminPhone;
          }
        }
      } catch(e) {}`;
code = code.replace(regexAdmins2, replaceAdmins2);

const regexTracking = /const localComplaints = safeJSONParse\(localStorage\.getItem\('app_complaints'\), \[\]\);\s*complaints = localComplaints\.filter\(\(c: any\) => c\.phone === trackPhone \|\| c\.id === trackPhone\);\s*\/\/ Also try fetching from RTDB to ensure latest\s*try \{/m;
const replaceTracking = `// Fetch from RTDB
      try {`;
code = code.replace(regexTracking, replaceTracking);

fs.writeFileSync('src/components/ComplaintForm.tsx', code);
