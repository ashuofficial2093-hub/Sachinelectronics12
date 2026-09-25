const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(
  `import Admin from './components/Admin';`,
  `import Admin from './components/Admin';\nimport AreaAdminDashboard from './components/AreaAdminDashboard';`
);

app = app.replace(
  `const [isAdmin, setIsAdmin] = useState(false);`,
  `const [isAdmin, setIsAdmin] = useState(false);\n  const [isAreaAdmin, setIsAreaAdmin] = useState(false);`
);

app = app.replace(
  `setIsAdmin(window.location.hash === '#admin' || window.location.hash === '#super-admin' || window.location.hash === '#area-admin');`,
  `setIsAdmin(window.location.hash === '#admin' || window.location.hash === '#super-admin');\n      setIsAreaAdmin(window.location.hash === '#area-admin');`
);

app = app.replace(
  `if (!isAdmin && !isTechnician && !isTechnicianRegistration) {`,
  `if (!isAdmin && !isAreaAdmin && !isTechnician && !isTechnicianRegistration) {`
);

app = app.replace(
  `}, [isAdmin, isTechnician, isTechnicianRegistration]);`,
  `}, [isAdmin, isAreaAdmin, isTechnician, isTechnicianRegistration]);`
);

const renderAdminBlock = `  if (isAdmin) {
    return <Admin />;
  }`;

app = app.replace(
  renderAdminBlock,
  renderAdminBlock + `\n  if (isAreaAdmin) {\n    return <AreaAdminDashboard />;\n  }`
);

fs.writeFileSync('src/App.tsx', app);
