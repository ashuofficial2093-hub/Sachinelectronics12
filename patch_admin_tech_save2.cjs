const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

// Ensure handleSaveNewTech matches exactly what user requested
const regex = /const handleSaveNewTech = \(e: React\.FormEvent\) => \{[\s\S]*?setNewTechModalOpen\(false\);[\s\S]*?\n  \};/m;

const newHandleSaveNewTech = `  const handleSaveNewTech = (e: React.FormEvent) => {
    e.preventDefault();
    const newTechData = {
      id: 'tech_' + Date.now().toString(),
      name: newTech.name,
      phone: newTech.mobile,
      mobile: newTech.mobile,
      pinCode: newTech.pincode || '208001',
      pincodes: [newTech.pincode || '208001'],
      specialization: newTech.skills || 'Electricals',
      skills: newTech.skills ? newTech.skills.split(',').map(s => s.trim()) : [],
      status: 'Approved',
      isActive: newTech.isActive,
      role: 'technician',
      createdAt: new Date().toISOString()
    };

    setTechnicians((prevTechs) => {
      const existing = JSON.parse(localStorage.getItem('app_area_techs') || '[]');
      const updatedList = [newTechData, ...existing];
      localStorage.setItem('app_area_techs', JSON.stringify(updatedList));
      return [newTechData, ...prevTechs];
    });

    setNewTechModalOpen(false);
    setNewTech({ name: '', mobile: '', pincode: '', skills: '', isActive: true });
  };`;

if(regex.test(code)) {
  code = code.replace(regex, newHandleSaveNewTech);
  fs.writeFileSync('src/components/Admin.tsx', code);
  console.log('Patched handleSaveNewTech successfully');
} else {
  console.log('Could not find handleSaveNewTech to patch');
}
