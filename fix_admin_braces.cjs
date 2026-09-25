const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

code = code.replace(/    \} catch\(e\) \{ console\.error\(e\); \}/, "      }\n    } catch(e) { console.error(e); }");

fs.writeFileSync('src/components/Admin.tsx', code);
