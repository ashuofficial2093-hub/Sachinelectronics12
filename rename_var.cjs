const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

code = code.replace(/const currentAdmins = safeJSONParse\(localStorage\.getItem\('app_area_admins'\), JSON\.parse\('\[\]'\)\);\s*let updatedAdmin = null;\s*if \(aaModal\.id\) \{\s*const index = currentAdmins\?\.findIndex\(\(a: any\) => a\.id === aaModal\.id\);\s*if \(index > -1\) \{\s*currentAdmins\[index\] = \{ \.\.\.currentAdmins\[index\], \.\.\.data \};\s*updatedAdmin = currentAdmins\[index\];\s*\}\s*\} else \{\s*const newAdmin = \{ \.\.\.data, id: Date\.now\(\)\.toString\(\) \};\s*currentAdmins\.push\(newAdmin\);\s*updatedAdmin = newAdmin;\s*\}\s*localStorage\.setItem\('app_area_admins', JSON\.stringify\(currentAdmins\)\);\s*setAreaAdmins\(currentAdmins\);/g, `const currentAdmins = safeJSONParse(localStorage.getItem('app_area_admins'), JSON.parse('[]'));
      
      let updatedAdmin = null;
      let updatedAdmins = [...currentAdmins];

      if (aaModal.id) {
        const index = updatedAdmins?.findIndex((a: any) => a.id === aaModal.id);
        if (index > -1) {
          updatedAdmins[index] = { ...updatedAdmins[index], ...data };
          updatedAdmin = updatedAdmins[index];
        }
      } else {
        const newAdmin = { ...data, id: Date.now().toString() };
        updatedAdmins.push(newAdmin);
        updatedAdmin = newAdmin;
      }
      
      localStorage.setItem('app_area_admins', JSON.stringify(updatedAdmins));
      setAreaAdmins(updatedAdmins);`);

fs.writeFileSync('src/components/Admin.tsx', code);
