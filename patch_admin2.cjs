const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

// Desktop tabs
code = code.replace(
  /<button onClick=\{\(\) => setActiveTab\('technicians'\)\} className=\{\`px-3 py-2 rounded-md text-sm font-medium \$\{activeTab === 'technicians' \? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'\}\`\}\>Technicians<\/button>/,
  `$&
  <button onClick={() => setActiveTab('technicianApplications')} className={\`px-3 py-2 rounded-md text-sm font-medium \${activeTab === 'technicianApplications' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}\`}>Pending Techs</button>`
);

// Mobile tabs
code = code.replace(
  /<button onClick=\{\(\) => setActiveTab\('technicians'\)\} className=\{\`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium \$\{activeTab === 'technicians' \? 'bg-blue-100 text-blue-700' : 'text-slate-600 bg-slate-100'\}\`\}\>Technicians<\/button>/,
  `$&
  <button onClick={() => setActiveTab('technicianApplications')} className={\`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium \${activeTab === 'technicianApplications' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 bg-slate-100'}\`}>Pending Techs</button>`
);

// State fetching
if (!code.includes('setTechnicianApplications(appSnapshot.docs.map')) {
  code = code.replace(
    /const techSnapshot = await getDocs\(techniciansCollection\);/,
    `const techSnapshot = await getDocs(techniciansCollection);
      const appSnapshot = await getDocs(collection(db, 'technicianApplications'));
      setTechnicianApplications(appSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));`
  );
}

// Add state if it wasn't added correctly
if (!code.includes('const [technicianApplications, setTechnicianApplications]')) {
  code = code.replace(
    /const \[technicians, setTechnicians\] = useState\<Technician\[\]\>\(\[\]\);/,
    `const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [technicianApplications, setTechnicianApplications] = useState<any[]>([]);`
  );
}

// Ensure activeTab includes technicianApplications
code = code.replace(
    /const \[activeTab, setActiveTab\] = useState\<'products' \| 'complaints' \| 'banner' \| 'inventory' \| 'technicians' \| 'promotions' \| 'ai-manager'\>\('ai-manager'\);/,
    `const [activeTab, setActiveTab] = useState<'products' | 'complaints' | 'banner' | 'inventory' | 'technicians' | 'promotions' | 'ai-manager' | 'technicianApplications'>('ai-manager');`
);

// Make sure collection is imported
if (!code.includes('collection,')) {
    code = code.replace(/import { addDoc, getDocs, /, "import { addDoc, getDocs, collection, ");
}

fs.writeFileSync('src/components/Admin.tsx', code);
