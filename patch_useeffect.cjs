const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

const newUseEffect = `  useEffect(() => {
    const savedAdmins = localStorage.getItem('app_area_admins');
    if (savedAdmins) {
      setAreaAdmins(JSON.parse(savedAdmins));
    }
  }, []);

  const fetchAreaAdmins`;

code = code.replace("  const fetchAreaAdmins", newUseEffect);

fs.writeFileSync('src/components/Admin.tsx', code);
console.log("Patched useEffect successfully!");
