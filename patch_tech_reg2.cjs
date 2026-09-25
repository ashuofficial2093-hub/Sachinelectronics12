const fs = require('fs');
let code = fs.readFileSync('src/components/TechnicianRegistration.tsx', 'utf8');

const regexOld = /const application: TechnicianApplication = \{[\s\S]*?createdAt: new Date\(\)\.toISOString\(\),\s*\};/m;
const newApp = `const applicationId = Date.now().toString();
      const application: TechnicianApplication & { id: string } = {
        id: applicationId,
        fullName: formData.fullName,
        mobile: formData.mobile,
        whatsapp: formData.whatsapp,
        city: formData.city,
        experience: Number(formData.experience),
        skills,
        documents,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      };`;

code = code.replace(regexOld, newApp);

// Also update the local storage push to not generate a new ID since we now include the ID in the object
code = code.replace(
  /pending\.push\(\{ \.\.\.application, id: Date\.now\(\)\.toString\(\) \}\);/g,
  `pending.push(application);`
);

fs.writeFileSync('src/components/TechnicianRegistration.tsx', code);
console.log('Patched TechnicianRegistration payload');
