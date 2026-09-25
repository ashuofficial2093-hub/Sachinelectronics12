const fs = require('fs');
let code = fs.readFileSync('src/components/ComplaintForm.tsx', 'utf8');

const functionToAdd = `  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!isValidFile(file)) {
        alert('Invalid file type or size. Please upload a valid image under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setIssueImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async`;

code = code.replace("const handleSubmit = async", functionToAdd);
fs.writeFileSync('src/components/ComplaintForm.tsx', code);
