const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

const oldState = `const [newTech, setNewTech] = useState({ name: '', mobile: '', pincode: '', skills: '', isActive: true });`;
const newState = `const [newTech, setNewTech] = useState({ name: '', mobile: '', pincode: '', skills: '', loginId: '', password: '', areaAdminId: '', isActive: true });`;

const oldSave = `      const handleSaveNewTech = (e: React.FormEvent) => {
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
    };`;

const newSave = `      const handleSaveNewTech = (e: React.FormEvent) => {
    e.preventDefault();
    const newTechData = {
      id: 'tech_' + Date.now().toString(),
      name: newTech.name,
      phone: newTech.mobile,
      mobile: newTech.mobile,
      loginId: newTech.loginId,
      password: newTech.password,
      areaAdminId: newTech.areaAdminId,
      pinCode: newTech.pincode || '208001',
      pincodes: [newTech.pincode || '208001'],
      specialization: newTech.skills || 'Electricals',
      skills: newTech.skills ? newTech.skills.split(',').map(s => s.trim()) : [],
      status: 'Approved',
      isActive: newTech.isActive,
      role: 'technician',
      createdAt: new Date().toISOString()
    };`;

const oldSetNewTech = `setNewTech({ name: '', mobile: '', pincode: '', skills: '', isActive: true });`;
const newSetNewTech = `setNewTech({ name: '', mobile: '', pincode: '', skills: '', loginId: '', password: '', areaAdminId: '', isActive: true });`;

code = code.replace(oldState, newState);
code = code.replace(oldSave, newSave);
// replace globally
code = code.split(oldSetNewTech).join(newSetNewTech);

fs.writeFileSync('src/components/Admin.tsx', code);
console.log('Patched newTech state and logic');
