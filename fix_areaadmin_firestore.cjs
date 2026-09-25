const fs = require('fs');
let code = fs.readFileSync('src/components/AreaAdminDashboard.tsx', 'utf8');

code = code.replace(/import \{ doc, updateDoc \} from "firebase\/firestore";/, "");
code = code.replace(/import \{ getDocs \} from "firebase\/firestore";/, "");

fs.writeFileSync('src/components/AreaAdminDashboard.tsx', code);
