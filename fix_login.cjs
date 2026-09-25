const fs = require('fs');
let code = fs.readFileSync('src/components/AreaAdminDashboard.tsx', 'utf8');

const oldLogin = /localStorage\.setItem\("app_current_area_admin", JSON\.stringify\(admin\)\);\n\s*fetchData\(\);/m;
const newLogin = `localStorage.setItem("app_current_area_admin", JSON.stringify(admin));
        window.location.reload();`;

code = code.replace(oldLogin, newLogin);
fs.writeFileSync('src/components/AreaAdminDashboard.tsx', code);
