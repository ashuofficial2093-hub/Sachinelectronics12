const fs = require('fs');
let code = fs.readFileSync('src/components/TechnicianRegistration.tsx', 'utf8');

code = code.replace(
  /\/\/ Fast Mock OCR Validation to avoid blocking[\s\S]*?return;\s*\}/,
  `// Fast Mock OCR Validation
      const fileName = file.name.toLowerCase();
      let isValid = true;
      if (type === 'pan' && !fileName.includes('pan')) {
        isValid = true; // Auto-pass for mock
      } else if ((type === 'aadhaarFront' || type === 'aadhaarBack') && !fileName.includes('aadhaar')) {
        isValid = true; // Auto-pass for mock
      }`
);

fs.writeFileSync('src/components/TechnicianRegistration.tsx', code);
