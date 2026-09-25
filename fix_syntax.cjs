const fs = require('fs');
let code = fs.readFileSync('src/components/AreaAdminDashboard.tsx', 'utf8');

code = code.replace(/return \(\) => unsubscribe\(\);\n  \}, \[\]\);\n    return \(\) => unsubscribe\(\);\n  \}, \[\]\);/g, "return () => unsubscribe();\n  }, []);");

fs.writeFileSync('src/components/AreaAdminDashboard.tsx', code);
