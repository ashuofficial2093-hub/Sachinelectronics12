const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

// 1. Update the state
code = code.replace(
  /const \[techAppModal, setTechAppModal\] = useState<\s*\{\s*isOpen: boolean,\s*appId: string,\s*action: 'Approved' \| 'Hold' \| 'Rejected' \| '',\s*reason: string,\s*phone: string,\s*name: string\s*\}\s*>\s*\(\{\s*isOpen: false,\s*appId: '',\s*action: '',\s*reason: '',\s*phone: '',\s*name: ''\s*\}\);/,
  `const [techAppModal, setTechAppModal] = useState<{isOpen: boolean, appId: string, action: 'Approved' | 'Hold' | 'Rejected' | '', reason: string, phone: string, name: string, loginId?: string, password?: string, areaAdminId?: string}>({isOpen: false, appId: '', action: '', reason: '', phone: '', name: '', loginId: '', password: '', areaAdminId: ''});`
);

// We need to also patch any other setTechAppModal({ isOpen: false, appId: '', action: '', reason: '', phone: '', name: '' })
code = code.replace(/setTechAppModal\(\{\s*isOpen: false,\s*appId: '',\s*action: '',\s*reason: '',\s*phone: '',\s*name: ''\s*\}\)/g, "setTechAppModal({ isOpen: false, appId: '', action: '', reason: '', phone: '', name: '', loginId: '', password: '', areaAdminId: '' })");

code = code.replace(/setTechAppModal\(\{\s*isOpen: true,\s*appId: id,\s*action,\s*reason: '',\s*phone,\s*name\s*\}\)/g, "setTechAppModal({ isOpen: true, appId: id, action, reason: '', phone, name, loginId: `TECH\${phone.slice(-6)}`, password: `Pass@\${Math.floor(1000 + Math.random() * 9000)}`, areaAdminId: '' })");

fs.writeFileSync('src/components/Admin.tsx', code);
console.log('Patched techAppModal state');
