const fs = require('fs');
let code = fs.readFileSync('src/components/TechnicianRegistration.tsx', 'utf8');

code = code.replace(
  /const allowedTypes = \['application\/pdf', 'image\/jpeg', 'image\/png', 'image\/jpg'\];\s*if \(!allowedTypes\.includes\(file\.type\)\) \{\s*alert\('Please upload only JPG, PNG, or PDF files\.'\);\s*return;\s*\}/,
  `if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
         alert('Please upload only Image or PDF files.');
         return;
      }`
);

fs.writeFileSync('src/components/TechnicianRegistration.tsx', code);
