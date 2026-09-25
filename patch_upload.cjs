const fs = require('fs');
let code = fs.readFileSync('src/components/TechnicianRegistration.tsx', 'utf8');

code = code.replace(
  /const handleFileUpload = async \([\s\S]*?reader\.readAsDataURL\(file\);\s*\}/,
  `const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: keyof typeof documents) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
         alert('Please upload only JPG, PNG, or PDF files.');
         return;
      }
      
      setIsUploading(prev => ({ ...prev, [type]: true }));

      // Fast Mock OCR Validation to avoid blocking
      const fileName = file.name.toLowerCase();
      let isValid = true;
      if (type === 'pan' && !fileName.includes('pan')) {
        isValid = window.confirm("Mock OCR: Does this image contain 'INCOME TAX DEPARTMENT'?");
      } else if ((type === 'aadhaarFront' || type === 'aadhaarBack') && !fileName.includes('aadhaar')) {
        isValid = window.confirm("Mock OCR: Does this image contain 'GOVERNMENT OF INDIA'?");
      }

      if (!isValid) {
        alert(\`Invalid \${type} image. Validation failed.\`);
        setIsUploading(prev => ({ ...prev, [type]: false }));
        // Clear input so they can reselect
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setDocuments(prev => ({ ...prev, [type]: reader.result as string }));
        setIsUploading(prev => ({ ...prev, [type]: false }));
      };
      reader.readAsDataURL(file);
    }`
);

fs.writeFileSync('src/components/TechnicianRegistration.tsx', code);
